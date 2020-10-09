<template>
  <div
    class="blog-tile flex mb5"
  >
    <router-link
      class="col-xs-3"
      :to="`/blog/${post.url_key}`"
    >
      <img
        v-lazy="imageObj"
        class="block w-100 h-auto"
        :title="post.featured_image_title"
        :alt="post.featured_image_alt"
      >
    </router-link>
    <div class="px10 pb20 pt20 slide-up b-white blog-tile__details">
      <router-link
        :to="`/blog/${post.url_key}`"
      >
        <h3 class="m0 uppercase c-black">
          {{ post.title }}
        </h3>
      </router-link>
      <div class="my10 info">
        by: {{ post.author_name }} | {{ publishDate }}
      </div>
      <p
        class="blog-tile__details-description"
        v-html="post.short_content"
      />
      <router-link
        v-if="post.short_content"
        :to="'/blog/' + post.url_key"
      >
        {{ $t('Read more') }}
      </router-link>
      <div class="blog-tile__categories mt10">
        <span
          v-for="(category, url) in categories"
          :key="url"
          class="mr10"
        >
          <router-link
            :to="`/blog/category/${url}`"
          >
            {{ category }}
          </router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      placeholder: '/assets/placeholder.jpg',
      imageLoaded: false
    }
  },
  computed: {
    categories () {
      return JSON.parse(this.post.blog_categories)
    },
    publishDate () {
      return dayjs.unix(this.post.publish_date).format('MM/DD/YY h:mmA')
    },
    imageObj () {
      return {
        src: this.post.featured_image_file,
        loading: this.placeholder,
        error: this.placeholder
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-tile {
  &__details {
    display: flex;
    flex-direction: column;

    &-description {
      flex: 1;
    }
  }
}
</style>
