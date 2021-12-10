import enUS from 'antd/lib/locale/en_US';
import zh from 'antd/lib/locale/zh_CN';
const LANGUAGE = 'I18N_LANGUAGE';
const LOCAL_LANGUAGE = [
  { language: 'en', title: 'English' },
  { language: 'zh', title: '简体中文' },
];
const LOCAL_LANGUAGE_LIST = LOCAL_LANGUAGE.map((i) => i.language);
const DEFAULT_LANGUAGE = LOCAL_LANGUAGE_LIST[0];

const getLocalLanguage = () => {
  let lang = navigator.language;
  if (typeof lang === 'string') {
    lang = lang.substr(0, 2);
  }
  return lang;
};
const ANTD_LOCAL: { [key: string]: any } = {
  zh,
  en: enUS,
};
export { LANGUAGE, LOCAL_LANGUAGE, LOCAL_LANGUAGE_LIST, getLocalLanguage, ANTD_LOCAL, DEFAULT_LANGUAGE };
