import { StorefrontModule } from '@vue-storefront/core/lib/modules'
import { getSearchAdapter } from '@vue-storefront/core/lib/search/adapter/searchAdapterFactory'
import { blogModule } from './state'
export const KEY = 'aheadworks-blog'

export const AheadworksBlog: StorefrontModule = function ({ app, store }) {
  store.registerModule(KEY, blogModule)

  getSearchAdapter().then((searchAdapter) => {
    searchAdapter.registerEntityType('cms_blog', {
      queryProcessor: (query) => {
        // function that can modify the query each time before it's being executed
        return query
      },
      resultProcessor: (resp, start, size) => {
        return searchAdapter.handleResult(resp, 'cms_blog', start, size)
      }
    })

    searchAdapter.registerEntityType('cms_blog_category', {
      queryProcessor: (query) => {
        // function that can modify the query each time before it's being executed
        return query
      },
      resultProcessor: (resp, start, size) => {
        return searchAdapter.handleResult(resp, 'cms_blog_category', start, size)
      }
    })
  })
}
