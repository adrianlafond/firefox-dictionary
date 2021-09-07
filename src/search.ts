/**
 * Format that results are returned in from the dictionary API.
 */
interface ApiResult {
  word: string;
  phonetic: string;
  phonetics: { text: string; audio?: string }[];
  origin: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example: string;
      synonyms: string[];
      antonyms: string[];
    }[];
  }[];
};

interface SearchResult {
  error?: number;
  data?: ApiResult[];
}

const search: {
  define: (word: string, lang?: string) => Promise<SearchResult>;
  getApiUrl: (word: string, lang?: string) => string;
  getWebUrl: (url: string, word: string, lang?: string) => string;
} = {
  define(word: string, lang = DEFAULT_LANG): Promise<SearchResult> {
    return fetch(search.getApiUrl(word, lang))
      .then(resp => resp.status === 200 ? resp.json() : resp.status)
      .then(json => (typeof json === 'number' ? { error: json } : { data: json }))
      .catch(() => ({ error: 400 }));
  },

  getApiUrl(word: string, lang = DEFAULT_LANG) {
    return `${API_URL}/${lang}/${word}`;
  },

  getWebUrl(url: string, word: string, lang = 'en') {
    return url.replace(/%s/g, word).replace(/%l/g, lang);
  }
};
