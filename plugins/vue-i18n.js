import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export default ({ app }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: 'zh-Hant-HK',
    fallbackLocale: 'zh-Hant-HK',
    messages: {
      'en-US': require('@/i18n/en-US.json'),
      'zh-Hant-HK': require('@/i18n/zh-Hant-HK.json'),
      'ja-JP': require('@/i18n/ja-JP.json')
    }
  });
};
