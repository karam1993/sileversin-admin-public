import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
// import VueGeolocation from 'vue-browser-geolocation'
// import VueCountryCode from 'vue-country-code'

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_API_KEY, // Add your here your google map api key
    libraries: 'places'
  }
})
// Vue.use(VueGeolocation)

////Country Code for phone numbers
// Vue.use(VueCountryCode)
