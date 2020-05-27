const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("D:\\projects\\js\\published\\dflex\\site\\.cache\\dev-404-page.js"))),
  "component---src-pages-404-js": hot(preferDefault(require("D:\\projects\\js\\published\\dflex\\site\\src\\pages\\404.js"))),
  "component---src-pages-dom-gen-index-md": hot(preferDefault(require("D:\\projects\\js\\published\\dflex\\site\\src\\pages\\dom-gen\\index.md"))),
  "component---src-pages-index-md": hot(preferDefault(require("D:\\projects\\js\\published\\dflex\\site\\src\\pages\\index.md"))),
  "component---src-pages-store-index-md": hot(preferDefault(require("D:\\projects\\js\\published\\dflex\\site\\src\\pages\\store\\index.md")))
}

