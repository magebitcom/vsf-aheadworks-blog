# Aheadworks Blog for Vue Storefront
Implement Aheadworks Blog extension in Vue Storefront! Comes with a sample layout that you can easiliy customize.

## Table of contents
* [Prerequisites](#prerequisites)
* [Installation](#installation)
  * [Magento 2 Indexer module](#magento-2-indexer-module)
  * [Vue Storefront module](#vue-storefront-module)
* [Example preview](#preview)
  
### Prerequisites
* Magento 2 with [VSBridge Indexer](https://github.com/DivanteLtd/magento2-vsbridge-indexer) and [Aheadworks Blog](https://ecommerce.aheadworks.com/magento-2-extensions/blog) extension
* **Vue Storefront v1.12** or greater
* Vue Storefront default theme, but can be implemented with capybara, by editing our blog components.
  
## Installation

#### Magento 2 Indexer module
To implement this module in your project, first you'll need to install our [Aheadworks Blog Indexer](https://github.com/magebitcom/vsf-aheadworks-blog-indexer) module for Magento 2 / VSBridge Indexer:
  * Via composer - `composer require magebit/aheadworks-blog-indexer`
  * For manual installation check the README here: https://github.com/magebitcom/vsf-aheadworks-blog-indexer
  
#### Vue Storefront module
  * Clone this repository inside `src/modules/`
    * `git clone git@github.com:magebitcom/vsf-aheadworks-blog.git ./src/modules/aheadworks-blog`
  * Register the module in `src/client.ts`
    ```js
    import { AheadworksBlog } from './aheadworks-blog'
    
    export function registerClientModules () {
      //...
      
      registerModule(AheadworksBlog)
    }

    ```
  * Register Blog routes inside `src/themes/your-theme/router/index.js` 
    ```js
    const BlogCategory = () => import(/* webpackChunkName: "vsf-aheadworks-blog-category" */ 'src/modules/aheadworks-blog/pages/BlogCategory.vue')
    const BlogPost = () => import(/* webpackChunkName: "vsf-aheadworks-blog-post" */ 'src/modules/aheadworks-blog/pages/BlogPost.vue')
    
    let routes = [
    // ...
    { name: 'aheadworks-blog-category', path: '/blog/category/:slug', component: BlogCategory },
    { name: 'aheadworks-blog-post', path: '/blog/:slug', component: BlogPost },
    { name: 'aheadworks-blog', path: '/blog', component: BlogCategory },
    // ...
    ```
  
  * Everything should be working by now, but you can also add blog entity types to your config:
    ```json
      "entities": {
        "blog_post": {
          "includeFields": [
            "id",
            "title",
            "url_key",
            "blog_categories",
            "blog_category_ids",
            "author_name",
            "publish_date",
            "featured_image_file",
            "featured_image_name",
            "featured_image_alt",
            "short_content",
            "content"
          ]
        },
        "blog_category": {
          "includeFields": [
            "id",
            "name",
            "url_key",
            "description",
            "image_file_name",
            "image_alt",
            "image_title",
            "meta_description",
            "meta_keywords",
            "meta_prefix",
            "meta_suffix",
            "meta_title",
            "sort_order"
          ]
        },
      }
    ```
## Preview
![Category page](https://i.imgur.com/pxyoGyy.png)
![Category page](https://i.imgur.com/cEh6juA.png)
![Post page](https://i.imgur.com/CtWYApJ.png)

---

![Magebit](https://magebit.com/img/magebit-logo-2x.png)

*Have questions or need help? Contact us at info@magebit.com*

