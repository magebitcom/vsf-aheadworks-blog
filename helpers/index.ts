import { AsyncDataLoader } from "@vue-storefront/core/lib/async-data-loader"

export async function getContext(ctx) {
  if (ctx) {
    return ctx
  }

  return new Promise(resolve => {
    AsyncDataLoader.push({
      execute: async (app) => {
        resolve(app.context)
      }
    })
  })
}