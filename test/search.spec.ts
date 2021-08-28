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
  it('mocks a successful response', async () => {
    console.log(apiUrl('test'));
    fetchMock.mock(apiUrl('test'), {
      body: { foo: 'bar' },
      status: 200,
    });
    const res = await search('test');
    expect(res.foo).toBe('bar');
  });
});
