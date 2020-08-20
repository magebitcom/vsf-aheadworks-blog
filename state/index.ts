import { Module } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { BlogState } from '../types'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'

export const blogModule: Module<BlogState, RootState> = {
  namespaced: true,
  state: {
    categories: [],
    posts: [],
    recent_posts: [],
    searchPostStats: null
  },
  getters,
  actions,
  mutations
}
