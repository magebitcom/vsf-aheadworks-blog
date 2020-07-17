export interface BlogState {
  categories: BlogCategory[],
  posts: BlogPost[],
  recent_posts: BlogPost[],
  searchPostStats: {}
}

export interface BlogCategorySearchOptions {
  filters?: { [key: string]: string[] | string | {[key: string]: string[] | string} },
  onlyActive?: boolean,
  size?: number,
  start?: number,
  sort?: string,
  includeFields?: string[],
  excludeFields?: string[]
}

export interface BlogPostSearchOptions {
  filters?: { [key: string]: string[] | string },
  onlyActive?: boolean,
  size?: number,
  start?: number,
  sort?: string,
  includeFields?: string[],
  excludeFields?: string[]
}

export interface BlogCategory {
  description?: string,
  id: number,
  image_alt?: string,
  image_file_name?: string,
  image_title?: string,
  is_description: number,
  meta_description?: string,
  meta_keywords?: string,
  meta_prefix?: string,
  meta_suffix?: string,
  meta_title?: string,
  name: string,
  sort_order: number,
  url_key: string
}

export interface BlogPost {
  author_name?: string,
  blog_categories: string,
  blog_category_ids: number[],
  content: string,
  featured_image_alt?: string,
  featured_image_file?: string,
  featured_image_title?: string,
  id: number,
  meta_description?: string,
  meta_keywords?: string,
  meta_prefix?: string,
  meta_suffix?: string,
  meta_title?: string,
  publish_date: number,
  short_content?: string,
  tags?: string,
  title: string,
  url_key: string
}
