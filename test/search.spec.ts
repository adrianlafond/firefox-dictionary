import * as fetchMock from 'fetch-mock';
import { search, API_URL } from '../src/search';

describe('search', () => {
  const url = (word: string, lang = 'en') => `${API_URL}/${lang}/${word}`;
  it('mocks a successful response', async () => {
    console.log(url('test'));
    fetchMock.mock(url('test'), {
      body: { foo: 'bar' },
      status: 200,
    });
    const res = await search('test');
    expect(res.foo).toBe('bar');
  });
});
