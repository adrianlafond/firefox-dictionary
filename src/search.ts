const apiUrl = (word: string, lang = DEFAULT_LANG) => `${API_URL}/${lang}/${word}`;

interface apiResult {
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

interface searchResult {
  error?: number;
  data?: apiResult[];
}

function search(word: string, lang = DEFAULT_LANG): Promise<searchResult> {
  return fetch(apiUrl(word, lang))
    .then(resp => resp.status === 200 ? resp.json() : resp.status)
    .then(json => (typeof json === 'number' ? { error: json } : { data: json }))
    .catch(() => ({ error: 400 }));
}
