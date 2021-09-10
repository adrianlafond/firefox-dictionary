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

class Search {
  static define(word: string, lang = DEFAULT_LANG): Promise<SearchResult> {
    return fetch(Search.getApiUrl(word, lang))
      .then(resp => resp.status === 200 ? resp.json() : resp.status)
      .then(json => (typeof json === 'number' ? { error: json } : { data: json }))
      .catch(() => ({ error: 400 }));
  }

  static getApiUrl(word: string, lang = DEFAULT_LANG) {
    return `${API_URL}/${lang}/${word}`;
  }

  static getWebUrl(url: string, word: string, lang = DEFAULT_LANG) {
    return url.replace(/%s/g, word).replace(/%l/g, lang);
  }
}

