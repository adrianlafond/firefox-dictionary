
class HandyDictionary {
  private panel: HTMLDivElement = document.createElement('div');
  private audio: PronunciationAudio = new PronunciationAudio(this.panel);

  // @ts-ignore Handlebars will be defined globally.
  private getTemplateHtml: (data: TemplateData) => string = Handlebars.compile(TEMPLATE);

  private loadingTimeout = 0;

  constructor() {
    this.initialize();
  }

  private static instance: HandyDictionary;

  static start() {
    if (!HandyDictionary.instance) {
      HandyDictionary.instance = new HandyDictionary();
    }
  }

  private initialize() {
    this.panel.className = BLOCK;
    document.body.appendChild(this.panel);
    browser.runtime.onMessage.addListener(this.handleContextMenuClick);
  }

  private handleContextMenuClick = async (message: { selectionText?: string }) => {
    const options = await this.getOptions();
    const word = message.selectionText || '';

    clearTimeout(this.loadingTimeout);
    this.loadingTimeout = window.setTimeout(() => {
      this.showPanel();
      this.panel.innerHTML = this.getTemplateHtml({
        ...this.getTemplateData(word, options),
        loading: true,
      });
    }, 250);

    const result = await Search.define(word,
      this.getSiteLang() || this.getUiLang());
    clearTimeout(this.loadingTimeout);
    this.showPanel();
    this.displaySearch(word, result, options);
  }

  getSiteLang() {
    const html = document.querySelector('html');
    if (html) {
      const lang = html.getAttribute('lang');
      if (lang && lang.length >= 2) {
        return lang.substring(0, 2);
      }
    }
    return null;
  }

  getUiLang() {
    return browser.i18n.getUILanguage().substring(0, 2);
  }

  async getOptions() {
    return await browser.storage.local.get({
      lang: DEFAULT_LANG,
      search: DEFAULT_SEARCH,
      searchUrl: '',
    });
  }

  showPanel() {
    if (!this.panel.classList.contains(`${BLOCK}--shown`)) {
      this.panel.classList.add(`${BLOCK}--shown`);
    }

    // @ts-ignore Popper will be defined globally.
    Popper.createPopper(
      window.getSelection()?.getRangeAt(0),
      this.panel,
      {
        modifiers: [{
          name: 'offset',
          options: { offset: [0, 10] },
        }],
      },
    );

    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('blur', this.onWindowBlur);
    window.addEventListener('pagehide', this.onWindowBlur);
    window.addEventListener('keydown', this.onKeyDown);
  }

  onMouseDown = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target && this.panel && this.panel !== target && !this.panel.contains(target)) {
      this.hidePanel();
    }
  }

  onWindowBlur = () => {
    this.hidePanel();
  }

  onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.hidePanel();
      event.preventDefault();
    }
  }

  hidePanel() {
    this.audio.destroy();
    this.panel.classList.remove(`${APP_ID}--shown`);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('blur', this.onWindowBlur);
    window.removeEventListener('pagehide', this.onWindowBlur);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  displaySearch(word: string, result: SearchResult, options: Record<string, any>) {
    const { error, data } = result;
    if(error === 404) {
      this.panel.innerHTML = this.getTemplateHtml({
        ...this.getTemplateData(word, options),
        notFound: word,
      });
    } else if (error) {
      this.panel.innerHTML = this.getTemplateHtml({
        ...this.getTemplateData(word, options),
        error,
      });
    } else if (data) {
      this.panel.innerHTML = this.getTemplateHtml({
        ...this.getTemplateData(word, options),
        data: {
          ...data,
        },
      });
      this.audio.initialize();
    }
  }

  getTemplateData(word: string, options: Record<string, any>): TemplateData {
    const lang = this.getSiteLang() || options.lang;
    const searchData = options.search === 'other'
      ? {
        label: 'the Web',
        href: Search.getWebUrl(options.searchUrl, word, lang),
      } : {
        label: SEARCH[options.search as keyof typeof SEARCH].label,
        href: Search.getWebUrl(
          SEARCH[options.search as keyof typeof SEARCH].url,
          word,
          lang,
        ),
      };

    return {
      search: {
        key: options.search,
        ...searchData,
      },
    };
  }
}

HandyDictionary.start();
