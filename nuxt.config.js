import config from './src/configs'

const { locale, availableLocales, fallbackLocale } = config.locales
const { gaId } = config.analytics

export default {
  ssr: false,
  // target: 'static',
  srcDir: 'src/',
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - Car Wash',
    title: 'Car Wash',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap' },
      { rel: 'stylesheet', href: 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css' },
      ...config.icons.map((href) => ({ rel: 'stylesheet', href }))
    ]
  },
  env: {
    baseUrl: process.env.BASE_URL,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    API: process.env.API
  },
  css: [
    '~/assets/scss/theme.scss'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    // plugins
    { src: '~/plugins/animate.js', mode: 'client' },
    { src: '~/plugins/apexcharts.js', mode: 'client' },
    { src: '~/plugins/clipboard.js', mode: 'client' },
    { src: '~/plugins/permissions.js', mode: 'client' },
    { src: '~/plugins/vue-shortkey.js', mode: 'client' },
    { src: '~/plugins/google-map' },
    // { src: '~/plugins/google-map.js' },

    // // // filters
    { src: '~/filters/capitalize.js' },
    { src: '~/filters/lowercase.js' },
    { src: '~/filters/uppercase.js' },
    { src: '~/filters/formatCurrency.js' },
    { src: '~/filters/formatDate.js' }
  ],
  buildModules: [
    ['@nuxtjs/vuetify', {
      customVariables: ['~/assets/scss/vuetify/variables/_index.scss'],
      optionsPath: '~/configs/vuetify.js',
      treeShake: true,
      defaultAssets: {
        font: false
      }
    }],
    ['nuxt-i18n', {
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected',
        alwaysRedirect: true
      },
      locales: availableLocales,
      lazy: true,
      langDir: 'translations/',
      defaultLocale: locale,
      vueI18n: {
        fallbackLocale
      }
    }]
  ],
  modules: [
    '@nuxtjs/google-gtag',
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  axios: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    baseURL: process.env.BASE_URL

  },

  auth: {
    resetOnError: true,
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/login',
            method: 'post',
            propertyName: 'data.token'
          },
          logout: { url: '/logout', method: 'post' },
          user: { url: '/my', method: 'get', propertyName: 'data' }
        },
        user: {
        },
        tokenType: 'Bearer'
      }
    },
    redirect: {
      login: '/auth/signin',
      logout: '/auth/signin',
      callback: '/auth/signin',
      home: '/'
    }
  },
  router: {
    middleware: ['auth']
  },
  build: {
    transpile: [/^vue2-google-maps($|\/)/]
  },
  server: {
    host: '0.0.0.0',
    port: 5000 // default: 3000
  }
}
