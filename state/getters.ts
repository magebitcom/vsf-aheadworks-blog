import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { BlogState } from '../types'
import { removeStoreCodeFromRoute } from '@vue-storefront/core/lib/multistore'

const getters: GetterTree<BlogState, RootState> = {
  getCategories: state => state.categories,
  getCategoryPosts: state => state.posts,
  getRecentPosts: state => state.recent_posts,
  getCurrentCategory: (state, getters, rootSate, rootGetters) => {
    const params = rootGetters['url/getCurrentRoute'].params

    if (params && params.slug) {
      return getters.getCategories.find(category => category.url_key === params.slug)
    }

    return null
  },
  getCurrentPost: (state, getters, rootSate, rootGetters) => {
    const params = rootGetters['url/getCurrentRoute'].params

    if (params && params.slug) {
      return getters.getCategoryPosts.find(post => post.url_key === params.slug)
    }

    return null
  },
  getCategoryFromPath: state => (path: string) => {
    return state.categories.find(category => (removeStoreCodeFromRoute(path) as string).replace(/^(\/)/gm, '') === category.url_key)
  },
  getSearchStats: state => state.searchPostStats,
  getTotalPosts: state => state.searchPostStats ? state.searchPostStats.total : 0
}

export default getters
