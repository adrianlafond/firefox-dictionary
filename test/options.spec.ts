import fs from 'fs';
import path from 'path';
import { DOMWindow, JSDOM } from 'jsdom';

const html = fs.readFileSync(path.resolve(__dirname, '../options/index.html'), 'utf8');

describe('options', () => {
  let $dom: JSDOM;
  let $window: DOMWindow;
  let $document: HTMLDocument;

  beforeEach(() => {
    $dom = new JSDOM(html, { runScripts: 'dangerously' });
    $window = $dom.window;
    $document = $window.document;
  });

  it('has a select for search engine', () => {
    expect($document.querySelector('select[name=search]')).toBeDefined();
  });
});
