export const API_URL = 'https://api.dictionaryapi.dev/api/v2/entries';

export function search(word: string, lang = 'en') {
  return fetch(`${API_URL}/${lang}/${word}`)
    .then(resp => resp.json());
}
