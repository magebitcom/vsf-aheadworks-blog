import { ActionTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import { BlogCategory, BlogState, BlogCategorySearchOptions, BlogPost, BlogPostSearchOptions } from '../types'
import { BlogCategoryService, BlogPostService } from '../data-resolver'
import { BLOG_ADD_CATEGORY, BLOG_SET_SEARCH_POSTS_STATS, BLOG_SET_CATEGORY_POSTS, BLOG_SET_RECENT_POSTS, BLOG_ADD_CATEGORIES, BLOG_ADD_POST } from './mutation-types'
import { Logger } from '@vue-storefront/core/lib/logger'

const actions: ActionTree<BlogState, RootState> = {
  async loadCategories ({ commit }, categorySearchOptions: BlogCategorySearchOptions): Promise<BlogCategory[]> {
    const { items } = await BlogCategoryService.getBlogCategories(categorySearchOptions)

    commit(BLOG_ADD_CATEGORIES, items)

    return items
  },

  /**
   * Load a single blog category from elasticsearch.
   *
   * @param {*} { commit }
   * @param {BlogCategorySearchOptions} categorySearchOptions
   * @returns {Promise<BlogCategory>}
   */
  async loadCategory ({ commit }, categorySearchOptions: BlogCategorySearchOptions): Promise<BlogCategory> {
    const { items } = await BlogCategoryService.getBlogCategories(categorySearchOptions)
    const category: BlogCategory = items && items.length ? items[0] : null

    if (category) {
      commit(BLOG_ADD_CATEGORY, category)
    } else {
      Logger.warn('Blog category not found', 'aheadworks-blog')()
    }

    return category
  },
  
  /**
   * Load a single blog post
   *
   * @param {*} { commit }
   * @param {BlogPostSearchOptions} postSearchOptions
   * @returns {Promise<BlogPost>}
   */
  async loadPost ({ commit }, postSearchOptions: BlogPostSearchOptions): Promise<BlogPost> {
    const { items } = await BlogPostService.getBlogPosts(postSearchOptions)
    const post: BlogPost = items && items.length ? items[0] : null

    if (post) {
      commit(BLOG_ADD_POST, post)
    } else {
      Logger.warn('Blog post not found', 'aheadworks-blog')()
    }

    return post
  },

  /**
   * Load posts from category
   *
   * @param {*} { commit }
   * @param {{ category: BlogCategory }} searchOptions
   * @returns {Promise<BlogPost[]>}
   */
  async loadCategoryPosts ({ commit, rootGetters }, {
    category,
    pageSize = 10
  } = {}): Promise<BlogPost[]> {
    const filters = {} as any

    if (category) {
      filters.blog_category_ids = { in: String(category.id) }
    }

    const currentRoute = rootGetters['url/getCurrentRoute']

    const { items, response } = await BlogPostService.getBlogPosts({
      filters,
      sort: currentRoute.query.sort,
      size: pageSize
    })

    commit(BLOG_SET_SEARCH_POSTS_STATS, {
      perPage: response.perPage,
      start: response.start,
      total: response.total
    })

    commit(BLOG_SET_CATEGORY_POSTS, items)

    return items
  },

  /**
   * Load more posts from category
   *
   * @param {*} { commit }
   * @param {{ category: BlogCategory }} searchOptions
   * @returns {Promise<BlogPost[]>}
   */
  async loadMoreCategoryPosts ({ commit, rootGetters, getters }, category: BlogCategory): Promise<BlogPost[]> {
    const filters = {} as any

    if (category) {
      filters.blog_category_ids = { in: String(category.id) }
    }

    const currentRoute = rootGetters['url/getCurrentRoute']
    const stats = getters['getSearchStats']

    const { items, response } = await BlogPostService.getBlogPosts({
      filters,
      sort: currentRoute.query.sort,
      start: stats.start + stats.perPage,
      size: stats.perPage
    })

    commit(BLOG_SET_SEARCH_POSTS_STATS, {
      perPage: response.perPage,
      start: response.start,
      total: response.total
    })

    commit(BLOG_ADD_CATEGORIES, items)

    return items
  },

  /**
   * Load most recent posts from any category
   *
   * @param {*} { commit }
   * @returns {Promise<BlogPost[]>}
   */
  async loadRecentPosts ({ commit }): Promise<BlogPost[]> {
    const { items } = await BlogPostService.getBlogPosts({ size: 5 })

    commit(BLOG_SET_RECENT_POSTS, items)

    return items
  }
}

export default actions
