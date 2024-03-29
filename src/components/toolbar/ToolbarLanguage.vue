<template>
  <v-menu
    offset-y
    left
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn text :icon="$vuetify.breakpoint.smAndDown" v-on="on">
        <flag-icon :round="$vuetify.breakpoint.smAndDown" :flag="currentLocale.flag"></flag-icon>
        <span v-show="$vuetify.breakpoint.mdAndUp && showLabel" :class="[$vuetify.rtl ? 'mr-1' : 'ml-1']">{{ currentLocale.name }}</span>
        <v-icon v-if="showArrow" right>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list dense nav class="borderCardInfo">
      <v-list-item v-for="locale in availableLocales" :key="locale.code" @click="setLocale(locale.code)">
        <flag-icon :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']" :flag="locale.flag"></flag-icon>
        <v-list-item-title>{{ locale.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import FlagIcon from '../common/FlagIcon'

/*
|---------------------------------------------------------------------
| Language Switcher Component
|---------------------------------------------------------------------
|
| Locale menu to choose the language based on the locales present in
| vue-i18n locales available array
|
*/
export default {
  components: {
    FlagIcon
  },
  props: {
    // Show dropdown arrow
    showArrow: {
      type: Boolean,
      default: false
    },
    // Show the country label
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    currentLocale() {
      return this.$i18n.locales.find((i) => i.code === this.$i18n.locale)
    },
    availableLocales () {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    }
  },
  created() {
    this.$vuetify.lang.t = (key, ...params) => this.$i18n.t(key, params)
  },
  methods: {
    setLocale(locale) {
      this.$vuetify.lang.current = locale

      // example on how certain languages can be RTL
      if (locale === 'ar') {
        this.$vuetify.rtl = true
      } else {
        this.$vuetify.rtl = false
      }

      this.$router.push(this.switchLocalePath(locale))
    }
  }
}
</script>
