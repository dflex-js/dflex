// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---cache-dev-404-page-js": () => import("./dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---src-pages-404-js": () => import("./../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */),
  "component---src-pages-dom-gen-index-md": () => import("./../src/pages/dom-gen/index.md" /* webpackChunkName: "component---src-pages-dom-gen-index-md" */),
  "component---src-pages-index-md": () => import("./../src/pages/index.md" /* webpackChunkName: "component---src-pages-index-md" */),
  "component---src-pages-store-index-md": () => import("./../src/pages/store/index.md" /* webpackChunkName: "component---src-pages-store-index-md" */)
}

