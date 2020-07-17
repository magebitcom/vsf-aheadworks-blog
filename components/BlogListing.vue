<template>
  <div class="blog-listing">
    <div
      v-for="(post) in posts"
      :key="post.id"
      class="blog-post"
      :class="post.class"
    >
      <blog-tile :post="post" />
    </div>
  </div>
</template>

<script>
import BlogTile from './BlogTile'

export default {
  components: {
    BlogTile
  },
  props: {
    posts: {
      type: null,
      required: true
    }
  }
}
</script>
