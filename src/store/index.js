import configs from '~/configs'

const { product, time, theme, currencies  } = configs

const { globalTheme, menuTheme, toolbarTheme, isToolbarDetached, isContentBoxed, isRTL } = theme
const { currency, availableCurrencies } = currencies

export const state = () => ({
  product,
  time,
  // currency
  currency,
  availableCurrencies,
  // themes and layout configurations
  globalTheme,
  menuTheme,
  toolbarTheme,
  isToolbarDetached,
  isContentBoxed,
  isRTL,
  toast: {
    show: false,
    color: 'black',
    message: '',
    timeout: 3000
  }
})

export const getters = {

}

export const mutations = {
  setGlobalTheme: (state, theme) => {
    this.$vuetify.framework.theme.dark = theme === 'dark'
    state.globalTheme = theme
  },
  setRTL: (state, isRTL) => {
    this.$vuetify.framework.rtl = isRTL
    state.isRTL = isRTL
  },
  setContentBoxed: (state, isBoxed) => {
    state.isContentBoxed = isBoxed
  },
  setMenuTheme: (state, theme) => {
    state.menuTheme = theme
  },
  setToolbarTheme: (state, theme) => {
    state.toolbarTheme = theme
  },
  setTimeZone: (state, zone) => {
    state.time.zone = zone
  },
  setTimeFormat: (state, format) => {
    state.time.format = format
  },
  setCurrency: (state, currency) => {
    state.currency = currency
  },
  setToolbarDetached: (state, isDetached) => {
    state.isToolbarDetached = isDetached
  },
  showToast: (state, toast) => {
    const { color, timeout, message } = toast

    state.toast = {
      message,
      color,
      timeout,
      show: true
    }
  },
  hideToast: (state) => {
    state.toast.show = false
  }
}

export const actions = {
  showToast ({ state, commit }, message) {
    if (state.toast.show) commit('hideToast')

    setTimeout(() => {
      commit('showToast', {
        color: 'black',
        message,
        timeout: 1500
      })
    })
  },
  showError ({ state, commit }, message  ) {
    if (state.toast.show) commit('hideToast')

    setTimeout(() => {
      commit('showToast', {
        color: 'error',
        message: message ,
        timeout: 1500
      })
    })
  },
  showSuccess ({ state, commit }, message) {
    if (state.toast.show) commit('hideToast')

    setTimeout(() => {
      commit('showToast', {
        color: 'success',
        message,
        timeout: 1500
      })
    })
  },
  async nuxtServerInit ({ dispatch }) {
    // await dispatch('checkUser')
    // await dispatch('setLoading', true)
  }
}
