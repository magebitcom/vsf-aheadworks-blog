<template>
  <div
    id="blog-listing"
  >
    <header class="container">
      <h1>
        {{ category ? category.name : $t('Blog') }}
      </h1>
      <p
        v-if="category && category.description"
        v-html="category.description"
      />
      <p v-else>
        {{ $t('Welcome to our blog!') }}
      </p>
    </header>
    <div class="container">
      <div class="row">
        <div class="col-xs-3">
          <div>
            <h2 class="mt0">
              {{ $t("Blog Categories") }}
            </h2>

            <ul v-if="categories">
              <li>
                <router-link
                  to="/blog"
                >
                  {{ $t('Home') }}
                </router-link>
              </li>
              <li
                v-for="(item, key) in categories"
                :key="key"
              >
                <router-link
                  :to="`/blog/category/${item.url_key}`"
                >
                  {{ item.name }}
                </router-link>
              </li>
            </ul>

            <h2>
              {{ $t("Recent Posts") }}
            </h2>

            <ul
              v-if="recentPosts"
              class="recent-posts p0 m0"
            >
              <li
                v-for="(item, key) in recentPosts"
                :key="key"
                class="mb5"
              >
                <router-link
                  class="flex middle-xs brdr-1 brdr-cl-primary"
                  :to="`/blog/${item.url_key}`"
                >
                  <img
                    class="block"
                    :src="item.featured_image_file"
                  >
                  <span class="p10">{{ item.title }}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-xs-9">
          <div class="flex between-xs middle-xs mb10">
            <breadcrumbs
              :with-homepage="true"
              :routes="routes"
              :active-route="activeRoute"
            />
            <base-select
              name="select"
              :selected="sort"
              :options="sortOptions"
              class="pr30 sort-by"
              @input="changeSortOrder"
            />
          </div>
          <blog-listing
            v-if="posts && posts.length"
            :posts="posts"
          />
          <div v-else>
            {{ $t('No posts found in this category') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Logger } from '@vue-storefront/core/lib/logger'
import { isServer } from '@vue-storefront/core/helpers'
import { htmlDecode } from '@vue-storefront/core/filters/html-decode'
import { mapGetters } from 'vuex'
import { getContext } from '../helpers'

// Components
import Breadcrumbs from 'theme/components/core/Breadcrumbs'
import BaseSelect from 'theme/components/core/blocks/Form/BaseSelect'
import BlogListing from '../components/BlogListing'

const POSTS_PER_PAGE = 10

const composeInitialPageState = async (store, route, context = null) => {
  try {
    await store.dispatch('aheadworks-blog/loadCategories', {
      size: 200
    })

    let currentCategory = null

    if (route.params.slug) {
      currentCategory = await store.getters['aheadworks-blog/getCurrentCategory']

      if (!currentCategory && isServer) {
        const ctx = await getContext(context)
        ctx.server.response.redirect('/page-not-found', 302)
      }

      await store.dispatch('aheadworks-blog/loadCategoryPosts', {
        category: currentCategory,
        perPage: POSTS_PER_PAGE
      })
    } else {
      // Load latest from any category
      await store.dispatch('aheadworks-blog/loadCategoryPosts', {
        perPage: POSTS_PER_PAGE
      })
    }

    await store.dispatch('aheadworks-blog/loadRecentPosts')
  } catch (e) {
    Logger.error('Problem with setting Blog Category initial data!', 'aheadworks-blog', e)()
  }
}

export default {
  components: {
    Breadcrumbs,
    BaseSelect,
    BlogListing
  },
  data () {
    return {
      sort: 'publish_date:desc'
    }
  },
  computed: {
    ...mapGetters({
      categories: 'aheadworks-blog/getCategories',
      category: 'aheadworks-blog/getCurrentCategory',
      posts: 'aheadworks-blog/getCategoryPosts',
      recentPosts: 'aheadworks-blog/getRecentPosts',
      totalPosts: 'aheadworks-blog/getTotalPosts'
    }),

    canLoadMore () {
      return this.posts.length < this.totalPosts
    },

    pageTitle () {
      const title = [this.$t('Blog')]

      if (this.category) {
        title.unshift(this.$t(this.category.name))
      }

      return title.join(' - ')
    },

    routes () {
      if (this.category) {
        return [
          { name: this.$t('Blog'), route_link: '/blog' }
        ]
      }

      return []
    },

    activeRoute () {
      return this.category ? this.category.name : this.$t('Blog')
    },

    sortOptions () {
      return [
        {
          value: 'publish_date:desc',
          label: this.$t('Sort by Newest')
        },
        {
          value: 'publish_date:asc',
          label: this.$t('Sort by Oldest')
        }
      ]
    }
  },
  async asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    await composeInitialPageState(store, route, context)
  },
  async beforeRouteEnter (to, from, next) {
    if (isServer) next() // SSR no need to invoke SW caching here
    else if (!from.name) { // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async vm => {
        vm.loading = true
        await composeInitialPageState(vm.$store, to)
        vm.loading = false
      })
    } else {
      next()
    }
  },
  metaInfo () {
    const metaData = [];

    if (this.category) {
      metaData.push({
        vmid: 'description',
        name: 'description',
        content: htmlDecode(this.category.meta_description)
      })

      metaData.push({
        vmid: 'title',
        title: htmlDecode(this.category.meta_title)
      })
    }

    return {
      title: htmlDecode(this.pageTitle || this.$route.meta.title),
      meta: metaData,
      link: [{ rel: 'canonical', href: this.$route.path }]
    }
  },
  mounted () {
    if (this.$route.query.sort) {
      this.sort = this.$route.query.sort
    }
  },
  methods: {
    changeSortOrder (order) {
      this.$router.push({
        query: {
          sort: order
        }
      })
    },
    loadMorePosts () {
      if (!this.canLoadMore) return
      this.$store.dispatch('aheadworks-blog/loadMoreCategoryPosts', this.currentCategory)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~theme/css/animations/transitions";

  /deep/ .sort-by select {
    font-size: 14px;
  }

  .recent-posts {
    list-style: none;

    img {
      width: 80px;
      height: auto;
    }

    a {
      text-decoration: none;
      transition: opacity $duration-main $motion-main;

      &:hover {
        opacity: 0.7;
      }

      &:after {
        display: none;
      }
    }
  }
</style>

<style>
  .h-auto {
    height: auto;
  }
</style>
