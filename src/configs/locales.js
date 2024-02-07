const locale = 'en'

export default {
  // current locale
  locale,

  // when translation is not available fallback to that locale
  fallbackLocale: 'en',

  // availabled locales for user selection
  availableLocales: [{
    code: 'en',
    flag: 'us',
    name: 'English',
    file: 'en.js'
  }, {
    code: 'ar',
    flag: 'sa',
    name: 'العربية',
    file: 'ar.js'
  }, {
    code: 'tr',
    flag: 'tr',
    name: 'Türkçe',
    file: 'tr.js'
  }]
}