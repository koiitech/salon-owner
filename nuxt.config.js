

require('dotenv').config()

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + 'Salon Management',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
    '~/assets/main.css'
  ],
  /*
  ** Middleware
  */
  router: {
    middleware: [
      // 'auth/index',
      'auth'
    ]
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/helpers.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/apollo',
    '@nuxtjs/auth'
  ],
  /*
  ** auth module configuration
  ** https://auth.nuxtjs.org/guide/scheme.html
  */
  auth: {
    strategies: {
      apollo: {
        _scheme: '~/plugins/auth/apollo-schema.js',
      },
    }
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    optionsPath: '~/configs/vuetify.config.js',
  },

  apollo: {
    clientConfigs: {
      default: '~/configs/apollo.config.js',
    },
    errorHandler: '~/plugins/apollo-error-handler.js',
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  layoutTransition: 'fade',
  pageTransition: 'fade',
}
