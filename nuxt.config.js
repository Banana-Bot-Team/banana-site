module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['element-ui/lib/theme-chalk/index.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/element-ui', '@/plugins/base64', '@plugins/vue-i18n'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Issue: https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/357
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://nuxt-typed-vuex.danielcroe.com
    'nuxt-typed-vuex'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: `http://localhost:${process.env.PORT || 3000}/api/v1`,
    browserBaseURL: '/api/v1'
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/, /typed-vuex/],
    /*
     ** You can extend webpack config here
     */
    extend(_config, _ctx) {}
  },
  /**
   * TypeScript Setting
   */
  typescript: {
    typeCheck: {
      eslint: true
    }
  }
  /**
   * Vue Config
   */
};
