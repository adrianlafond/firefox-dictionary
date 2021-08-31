const apiUrl = (word: string, lang = DEFAULT_LANG) => `${API_URL}/${lang}/${word}`;

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

function search(word: string, lang = DEFAULT_LANG): Promise<SearchResult> {
  console.log(apiUrl(word, lang));
  return fetch(apiUrl(word, lang))
    .then(resp => resp.status === 200 ? resp.json() : resp.status)
    .then(json => (typeof json === 'number' ? { error: json } : { data: json }))
    .catch(() => ({ error: 400 }));
}
