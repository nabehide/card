const pkg = require('./package')

const generateBase = process.env.NODE_ENV === 'production' ? {
  generate: {
    dir: "docs",
  },
} : {}
const routerBase = process.env.NODE_ENV === 'production' ? {
  router: {
    base: '/card',
  },
} : {}

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  /*
  modules: [
    'nuxt-webfontloader',
  ],
  webfontloader: {
    google: {
      families: { 'Lato:400,700' },
    },
  },
  */

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: '/node_modules/',
      })
    }
  },
  ...generateBase,
  ...routerBase,
}
