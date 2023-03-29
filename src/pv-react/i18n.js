import { __awaiter, __generator } from 'tslib';
import i18next from 'i18next';
// import { initReactI18next } from 'react-i18next';
import en_translation from './i18n_en_translation.json';
import pt_translation from './i18n_pt_translation.json';
// import Backend from 'i18next-xhr-backend';
// import LanguageDetector from 'i18next-browser-languagedetector';
// not like to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init
export var resources = {
  en: {
    translation: en_translation,
  },
  pt: {
    translation: pt_translation,
  },
};
export function setLang(lang) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            i18next
              // .use(SyncBackend)
              // load translation using xhr -> see /public/locales
              // learn more: https://github.com/i18next/i18next-xhr-backend
              // .use(Backend)
              // detect user language
              // learn more: https://github.com/i18next/i18next-browser-languageDetector
              // .use(LanguageDetector)
              // pass the i18n instance to react-i18next.
              // .use(initReactI18next)
              // init i18next
              // for all options read: https://www.i18next.com/overview/configuration-options
              .init({
                // lng: 'en',
                lng: lang,
                resources: resources,
                initImmediate: false,
                fallbackLng: 'en',
                debug: true,
              }),
          ];
        case 1:
          _a.sent();
          localStorage.setItem('Language', lang);
          return [2 /*return*/];
      }
    });
  });
}
export function setDefaultLang(defLang) {
  var lang = localStorage.getItem('Language');
  if (lang) {
    return setLang(lang);
  } else {
    return setLang(defLang);
  }
}
setDefaultLang('en').catch(function (reason) {
  return console.error(reason);
});
export function getDefaultLang() {
  return localStorage.getItem('Language');
}
export default i18next;
//# sourceMappingURL=i18n.js.map
