type PanelType = HTMLDivElement | null;

const dictionary: any = {
  panel: null,
  template: null,
  loadingTimeout: 0,

  handleContextMenuClick: async (message: { selectionText?: string }) => {
    const options = await dictionary.getOptions();
    const word = message.selectionText || '';
    clearTimeout(dictionary.loadingTimeout);
    dictionary.loadingTimeout = setTimeout(() => {
      dictionary.createPanel();
      dictionary.showPanel();
      dictionary.panel.innerHTML = dictionary.template({
        ...dictionary.getTemplateData(word, options),
        loading: true,
      });
    }, 250);

    const result = await search.define(word, dictionary.getSiteLang() || options.lang);
    clearTimeout(dictionary.loadingTimeout);
    dictionary.createPanel();
    dictionary.showPanel();
    dictionary.displaySearch(word, result, options);
  },

  getSiteLang() {
    const html = document.querySelector('html');
    if (html) {
      const lang = html.getAttribute('lang');
      if (lang && lang.length >= 2) {
        return lang.substring(0, 2);
      }
    }
    return null;
  },

  getOptions() {
    return browser.storage.local.get({
      lang: DEFAULT_LANG,
      search: DEFAULT_SEARCH,
      searchUrl: '',
    })
   .then((record: Record<string, any>) => record);
  },

  createPanel() {
    if (!dictionary.panel) {
      dictionary.panel = document.createElement('div');
      dictionary.panel.className = BLOCK;

      // @ts-ignore Handlebars will be defined globally.
      dictionary.template = Handlebars.compile(TEMPLATE);

      document.body.appendChild(dictionary.panel);
    }
  },

  showPanel() {
    if (!dictionary.panel.classList.contains(`${BLOCK}--shown`)) {
      dictionary.panel.classList.add(`${BLOCK}--shown`);
    }

    // @ts-ignore Popper will be defined globally.
    Popper.createPopper(
      window.getSelection()?.getRangeAt(0),
      dictionary.panel,
      {},
    );

    window.addEventListener('mousedown', dictionary.onMouseDown);
    window.addEventListener('blur', dictionary.onWindowBlur);
    window.addEventListener('keydown', dictionary.onKeyDown);
  },

  onMouseDown: (event: MouseEvent) => {
    const { panel } = dictionary;
    const target = event.target as HTMLElement
    if (target && panel && panel !== target && !panel.contains(target)) {
      dictionary.hidePanel();
    }
  },

  onWindowBlur: () => {
    dictionary.hidePanel();
  },

  onKeyDown: (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      dictionary.hidePanel();
      event.preventDefault();
    }
  },

  hidePanel() {
    audio.destroy();
    dictionary.panel.classList.remove(`${APP_ID}--shown`);
    window.removeEventListener('mousedown', dictionary.onMouseDown);
    window.removeEventListener('blur', dictionary.onWindowBlur);
    window.removeEventListener('keydown', dictionary.onKeyDown);
  },

  displaySearch(word: string, result: SearchResult, options: Record<string, any>) {
    const { error, data } = result;
    const { panel } = dictionary;

    if (error === 404) {
      panel.innerHTML = dictionary.template({
        ...dictionary.getTemplateData(word, options),
        notFound: word,
      });
    } else if (error) {
      panel.innerHTML = dictionary.template({
        ...dictionary.getTemplateData(word, options),
        error,
      });
    } else if (data) {
      panel.innerHTML = dictionary.template({
        ...dictionary.getTemplateData(word, options),
        data: {
          ...data,
        },
      });
      audio.init(panel);
    }
  },

  getTemplateData(word: string, options: Record<string, any>) {
    const lang = dictionary.getSiteLang() || options.lang;
    const searchData = options.search === 'other'
      ? {
        label: 'the Web',
        href: search.getWebUrl(options.searchUrl, word, lang),
      } : {
        label: SEARCH[options.search as keyof typeof SEARCH].label,
        href: search.getWebUrl(
          SEARCH[options.search as keyof typeof SEARCH].url,
          word,
          lang,
        ),
      };

    return {
      loading: false,
      notFound: null,
      error: false,
      search: {
        key: options.search,
        ...searchData,
      },
      data: null,
    };
  },

  init: () => {
    browser.runtime.onMessage.addListener(dictionary.handleContextMenuClick);
  },
};

dictionary.init();
