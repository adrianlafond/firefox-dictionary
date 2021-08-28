export const API = 'https://api.dictionaryapi.dev/api/v2/entries';

export const apiUrl = (word: string, lang = 'en') => `${API}/${lang}/${word}`;

export function search(word: string, lang = 'en') {
  return fetch(apiUrl(word, lang))
    .then(resp => resp.json());
}
