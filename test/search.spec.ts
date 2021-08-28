import * as fetchMock from 'fetch-mock';
import { search, apiUrl } from '../src/search';

describe('apiUrl()', () => {
  it('includes the lang in the url', () => {
    expect(apiUrl('test', 'xy')).toContain('/xy/');
  });
  it('includes the search term in the url', () => {
    expect(apiUrl('test')).toContain('/test');
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
    fetchMock.mock(apiUrl('hello'), {
      body: successResponse,
      status: 200,
    });
    const res = await search('hello');
    expect(res.data?.[0].word).toBe('hello');
    expect(res.error).toBeUndefined();
  });
  it('returns an appropriate error for not found', async () => {
    fetchMock.mock(apiUrl('test'), 404);
    const res = await search('test');
    expect(res.error).toBe(404);
  });
  it('returns an appropriate error for server error', async () => {
    fetchMock.mock(apiUrl('test'), 500);
    const res = await search('test');
    expect(res.error).toBe(500);
  });
  it('returns an error when fetch throws an error', async () => {
    fetchMock.catch
    fetchMock.mock(apiUrl('test'), {
      throws: new Error('fetch failed!')
    });
    const res = await search('test');
    expect(res.error).toBe(400);
  });
});
