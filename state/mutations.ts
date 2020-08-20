import { MutationTree } from 'vuex'
import { BlogState, BlogCategory, BlogPost } from '../types'
import {
  BLOG_ADD_POST,
  BLOG_ADD_CATEGORY,
  BLOG_SET_SEARCH_POSTS_STATS,
  BLOG_SET_CATEGORY_POSTS,
  BLOG_SET_RECENT_POSTS,
  BLOG_ADD_CATEGORIES
} from './mutation-types'

const mutations: MutationTree<BlogState> = {
  [BLOG_ADD_CATEGORY] (state, category: BlogCategory) {
    const categoryIds = state.categories.map(category => category.id)
    if (categoryIds.indexOf(category.id) < 0) {
      state.categories.push(category)
    }
  },

  [BLOG_ADD_POST] (state, post: BlogPost) {
    const postIds = state.posts.map(post => post.id)
    if (postIds.indexOf(post.id) < 0) {
      state.posts.push(post)
    }
  },

  [BLOG_SET_SEARCH_POSTS_STATS] (state, stats) {
    state.searchPostStats = stats
  },

  [BLOG_SET_CATEGORY_POSTS] (state, posts: BlogPost[]) {
    state.posts = posts || []
  },

  [BLOG_ADD_CATEGORIES] (state, posts: BlogPost[]) {
    const postIds = state.posts.map(post => post.id)
    posts.forEach(post => {
      if (postIds.indexOf(post.id) < 0) {
        state.posts.push(post)
      }
    })
  },

  [BLOG_SET_RECENT_POSTS] (state, posts: BlogPost[]) {
    state.recent_posts = posts || []
  },

  [BLOG_ADD_CATEGORIES] (state, categories: BlogCategory[]) {
    const categoryIds = state.categories.map(category => category.id)

    categories.forEach(category => {
      if (categoryIds.indexOf(category.id) < 0) {
        state.categories.push(category)
      }
    })
  }
}

export default mutations
