<template>
  <div class="blog-post">
    <template v-if="post">
      <div class="container">
        <div class="row">
          <div class="col-xs-3">
            <h2 class="mt20">
              {{ $t('Blog Categories') }}
            </h2>
            <ul v-if="categories">
              <li>
                <router-link to="/blog">
                  {{ $t('Home') }}
                </router-link>
              </li>
              <li
                v-for="(item, key) in categories"
                :key="key"
              >
                <router-link :to="`/blog/category/${item.url_key}`">
                  {{ item.name }}
                </router-link>
              </li>
            </ul>

            <h2>{{ $t('Recent Posts') }}</h2>
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
          <div class="col-xs-9">
            <img
              align="left"
              class="block blog-post__image mt30 mr10 mb10"
              :alt="post.featured_image_alt"
              :src="post.featured_image_file"
            >

            <h1 class="my10">
              {{ post.title }}
            </h1>
            <p
              class="mt0"
              v-html="post.short_content"
            />
            <p>
              <span v-if="post.author_name">{{ $t('by') }}: {{ post.author_name }} | </span> {{ publishDate }}
            </p>
            <div v-html="post.content" />
            <div
              v-if="postCategories"
              class="mt5"
            >
              <router-link
                v-for="(category, key) in postCategories"
                :key="key"
                class="mr5"
                :to="`/blog/category/${key}`"
              >
                {{ category }}
              </router-link>
            </div>
          </div>
        </div>
        <script
          type="application/ld+json"
          v-html="structuredData"
        />
      </div>
    </template>
    <template v-else>
      <div class="container flex middle-xs center-xs post-not-found">
        <h2>Oops!</h2>
        <p class="h4">
          {{ $t('We couldn\'t find the post you were looking for') }}
        </p>
        <router-link to="/blog">
          {{ $t('Click here to go back') }}
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { Logger } from '@vue-storefront/core/lib/logger'
import { isServer } from '@vue-storefront/core/helpers'
import config from 'config'
import { htmlDecode } from '@vue-storefront/core/filters/html-decode'
import { mapGetters } from 'vuex'
import moment from 'moment'

const composeInitialPageState = async (store, route, force = false) => {
  try {
    await store.dispatch('aheadworks-blog/loadCategories', {
      size: 200
    })

    const cached = store.getters['aheadworks-blog/getCurrentPost']
    if (!cached && route.params.slug) {
      await store.dispatch('aheadworks-blog/loadPost', {
        filters: {
          url_key: route.params.slug
        }
      })
    }

    await store.dispatch('aheadworks-blog/loadRecentPosts')
  } catch (e) {
    Logger.error('Problem with setting Blog Category initial data!', 'aheadworks-blog', e)()
  }
}

export default {
  computed: {
    ...mapGetters({
      post: 'aheadworks-blog/getCurrentPost',
      recentPosts: 'aheadworks-blog/getRecentPosts',
      categories: 'aheadworks-blog/getCategories'
    }),
    postCategories () {
      return JSON.parse(this.post.blog_categories)
    },
    publishDate () {
      return moment.unix(this.post.publish_date).format('MM/DD/YY h:mmA')
    },
    pageTitle () {
      const title = [this.post.title, this.$t('Blog')]
      return title.join(' - ')
    },
    structuredData () {
      return `{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': '${this.$route.fullPath}'
        },
        'headline': '${this.post.title}',
        'image': [
          '${this.post.featured_image_file}'
        ],
        'datePublished': '${moment.unix(this.post.publish_date).format('YYYY-MM-DD H:mm')}',
        'dateModified': '${moment.unix(this.post.publish_date).format('YYYY-MM-DD H:mm')}',
        'author': {
          '@type': 'Person',
          'name': '${this.post.author_name}'
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Vue Storefront',
          'logo': {
            '@type': 'ImageObject',
            'url': '/assets/logo.svg'
          }
        }
      }`
    }
  },
  async asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    await composeInitialPageState(store, route)
  },
  async beforeRouteEnter (to, from, next) {
    if (isServer) next() // SSR no need to invoke SW caching here
    else if (!from.name) { // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async vm => {
        vm.loading = true
        await composeInitialPageState(vm.$store, to, true)
        vm.loading = false
      })
    } else {
      next()
    }
  },
  metaInfo () {
    const metaData = [
      {
        vmid: 'description',
        name: 'description',
        content: this.post.meta_description
      },
      {
        name: 'title',
        content: this.post.meta_title
      }
    ];

    return {
      title: htmlDecode(this.pageTitle || this.$route.meta.title),
      meta: metaData,
      link: [{ rel: 'canonical', href: this.$route.path }]
    }
  },
  methods: {
    dateToReadable (date) {
      return moment.unix(date).format('MM/DD/YY h:mmA')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";

.blog-post {
  &__image {
    width: 300px;
    height: auto;
  }
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
.post-not-found {
  min-height: 500px;
  flex-direction: column;
}
</style>
