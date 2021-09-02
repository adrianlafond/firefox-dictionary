const APP_ID = 'extension-handy-dictionary';

const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries';

const SEARCH = {
  google: {
    label: 'Google',
    url: 'https://www.google.com/search?q=%s',
  },
  bing: {
    label: 'Bing',
    url: 'https://www.bing.com/search?q=%s',
  },
  ddg: {
    label: 'DuckDuckGo',
    url: 'https://www.bing.com/search?q=%s',
  },
  ecosia: {
    label: 'Ecosia',
    url: 'https://www.ecosia.org/search?q=%s',
  },
  wikipedia: {
    label: 'Wikipedia',
    url: 'https://%l.wikipedia.org/wiki/%s',
  },
};

const DEFAULT_LANG = 'en';

const DEFAULT_SEARCH = 'ecosia';
