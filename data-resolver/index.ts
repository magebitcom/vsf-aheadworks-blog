import config from 'config'
import get from 'lodash-es/get'
import { SearchQuery } from 'storefront-query-builder'
import { quickSearchByQuery } from '@vue-storefront/core/lib/search'
import BlogCategory from 'src/modules/blog/types/BlogCategory'
import { BlogCategorySearchOptions, BlogPost } from '../types'

const getBlogCategories = async ({
  filters = {},
  onlyActive = true,
  size = 4000,
  start = 0,
  sort = 'publish_date:desc',
  includeFields = config.entities.optimize ? get(config, 'entities.blog_category.includeFields', null) : null,
  excludeFields = config.entities.optimize ? get(config, 'entities.blog_category.excludeFields', null) : null
}: BlogCategorySearchOptions) => {
  let searchQuery = new SearchQuery()

  for (const [key, value] of Object.entries(filters)) {
    if (value === null) continue

    if (Array.isArray(value)) {
      searchQuery = searchQuery.applyFilter({ key, value: { 'in': value } })
    } else if (typeof value === 'object') {
      searchQuery = searchQuery.applyFilter({ key, value })
    } else {
      searchQuery = searchQuery.applyFilter({ key, value: { 'eq': value } })
    }
  }

  if (onlyActive) {
    searchQuery = searchQuery.applyFilter({ key: 'status', value: { 'eq': 1 } })
  }

  const response = await quickSearchByQuery({
    entityType: 'cms_blog_category',
    query: searchQuery,
    sort,
    size,
    start,
    includeFields,
    excludeFields
  })

  return {
    items: response.items as BlogCategory[],
    response
  }
}

export const BlogCategoryService = {
  getBlogCategories
}

const getBlogPosts = async ({
  filters = {},
  onlyActive = true,
  size = 4000,
  start = 0,
  sort = 'publish_date:desc',
  includeFields = config.entities.optimize ? get(config, 'entities.blog_post.includeFields', null) : null,
  excludeFields = config.entities.optimize ? get(config, 'entities.blog_post.excludeFields', null) : null
}: BlogCategorySearchOptions) => {
  let searchQuery = new SearchQuery()

  for (const [key, value] of Object.entries(filters)) {
    if (value === null) continue

    if (Array.isArray(value)) {
      searchQuery = searchQuery.applyFilter({ key, value: { 'in': value } })
    } else if (typeof value === 'object') {
      searchQuery = searchQuery.applyFilter({ key, value })
    } else {
      searchQuery = searchQuery.applyFilter({ key, value: { 'eq': value } })
    }
  }

  if (onlyActive) {
    searchQuery = searchQuery.applyFilter({ key: 'status', value: { 'eq': 1 } })
  }

  const response = await quickSearchByQuery({
    entityType: 'cms_blog',
    query: searchQuery,
    sort,
    size,
    start,
    includeFields,
    excludeFields
  })

  return {
    items: response.items as BlogPost[],
    response
  }
}

export const BlogPostService = {
  getBlogPosts
}
