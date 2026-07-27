import 'vue-router'

// To ensure it is treated as a module, add at least one `export` statement
export {}

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    layout?: 'DefaultLayout' | 'EmptyLayout'
    // must be declared by every route
    title?: string
    description?: string
  }
}
