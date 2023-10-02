import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { replaceCodePlugin } from 'vite-plugin-replace'

const PORT = 3003

const moduleResolution = [
  {
    find: '@dflex/dnd',
    replacement: path.resolve('../../packages/dflex-dnd/src/index.ts')
  },
  {
    find: '@dflex/utils',
    replacement: path.resolve('../../packages/dflex-utils/src/index.ts')
  },
  {
    find: '@dflex/core-instance',
    replacement: path.resolve('../../packages/dflex-core-instance/src/index.ts')
  },
  {
    find: '@dflex/draggable',
    replacement: path.resolve('../../packages/dflex-draggable/src/index.ts')
  },
  {
    find: '@dflex/store',
    replacement: path.resolve('../../packages/dflex-store/src/index.ts')
  },
  {
    find: '@dflex/dom-gen',
    replacement: path.resolve('../../packages/dflex-dom-gen/src/index.ts')
  }
]

const { PACKAGE_BUNDLE } = process.env

const isProdBundle = PACKAGE_BUNDLE === 'production'

const green = '\x1b[32m'
const cyan = '\x1b[36m'
const red = '\x1b[31m'
const magenta = '\x1b[35m'
const resetColor = '\x1b[0m'
const yellow = '\x1b[33m'

// eslint-disable-next-line no-console
console.clear()
// eslint-disable-next-line no-console
console.info(
  `${yellow}🚀 Using ${isProdBundle ? `${green}package` : `${cyan}self-built`} bundle. Running in ${
    isProdBundle ? `${red}production` : `${magenta}development`
  } mode. 🎉${resetColor}`
)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    replaceCodePlugin({
      replacements: [
        {
          from: /__DEV__/g,
          to: 'true'
        }
      ]
    })
  ],
  server: {
    port: PORT
  },
  preview: {
    port: PORT
  },

  resolve: isProdBundle
    ? undefined
    : {
        alias: moduleResolution
      }
})
