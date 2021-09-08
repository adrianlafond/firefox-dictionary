import fetchMock from 'fetch-mock';
import { search } from '../temp/search';

describe('apiUrl()', () => {
  it('includes the lang in the url', () => {
    expect(search.getApiUrl('test', 'xy')).toContain('/xy/');
  });
  it('includes the search term in the url', () => {
    expect(search.getApiUrl('test')).toContain('/test');
  })
});

describe('search()', () => {
  const successResponse = [
    {
      "word": "hello",
      "phonetic": "həˈləʊ",
      "phonetics": [
        {
          "text": "həˈləʊ",
          "audio": "//ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3"
        },
        {
          "text": "hɛˈləʊ"
        }
      ],
      "origin": "early 19th century: variant of earlier hollo ; related to holla.",
      "meanings": [
        {
          "partOfSpeech": "exclamation",
          "definitions": [
            {
              "definition": "used as a greeting or to begin a phone conversation.",
              "example": "hello there, Katie!",
              "synonyms": [],
              "antonyms": []
            }
          ]
        },
        {
          "partOfSpeech": "noun",
          "definitions": [
            {
              "definition": "an utterance of ‘hello’; a greeting.",
              "example": "she was getting polite nods and hellos from people",
              "synonyms": [],
              "antonyms": []
            }
          ]
        },
        {
          "partOfSpeech": "verb",
          "definitions": [
            {
              "definition": "say or shout ‘hello’.",
              "example": "I pressed the phone button and helloed",
              "synonyms": [],
              "antonyms": []
            }
          ]
        }
      ]
    }
  ];

  afterEach(() => {
    fetchMock.restore();
  });

  it('returns a successful response', async () => {
    fetchMock.mock(search.getApiUrl('hello'), {
      body: successResponse,
      status: 200,
    });
    const res = await search.define('hello');
    expect(res.data?.[0].word).toBe('hello');
    expect(res.error).toBeUndefined();
  });
  it('returns an appropriate error for not found', async () => {
    fetchMock.mock(search.getApiUrl('test'), 404);
    const res = await search.define('test');
    expect(res.error).toBe(404);
  });
  it('returns an appropriate error for server error', async () => {
    fetchMock.mock(search.getApiUrl('test'), 500);
    const res = await search.define('test');
    expect(res.error).toBe(500);
  });
  it('returns an error when fetch throws an error', async () => {
    fetchMock.catch
    fetchMock.mock(search.getApiUrl('test'), {
      throws: new Error('fetch failed!')
    });
    const res = await search.define('test');
    expect(res.error).toBe(400);
  });
});
