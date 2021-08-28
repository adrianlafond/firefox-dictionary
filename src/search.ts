import { lang as defaultLang } from './settings';

export const API = 'https://api.dictionaryapi.dev/api/v2/entries';

export const apiUrl = (word: string, lang = defaultLang) => `${API}/${lang}/${word}`;

export interface apiResult {
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

export interface searchResult {
  error?: number;
  data?: apiResult[];
}

export function search(word: string, lang = defaultLang): Promise<searchResult> {
  return fetch(apiUrl(word, lang))
    .then(resp => resp.status === 200 ? resp.json() : resp.status)
    .then(json => (typeof json === 'number' ? { error: json } : { data: json }))
    .catch(() => ({ error: 400 }));
}
