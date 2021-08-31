type PanelType = HTMLDivElement | null;

const dictionary: {
  panel: PanelType;
  template: any;
  handleContextMenuClick: (message: { selectionText?: string }) => void;
  onMouseDown: (event: MouseEvent) => void;
  getDefinitionPanel(): HTMLDivElement;
  init: () => void;
} = {
  panel: null,
  template: null,

  handleContextMenuClick: (message: { selectionText?: string }) => {
    // @ts-ignore Popper will be defined globally.
    const { createPopper } = Popper;

    const selection = window.getSelection();
    const word = message.selectionText || '';

    const panel = dictionary.getDefinitionPanel();
    if (!panel.classList.contains(`${BLOCK}--shown`)) {
      panel.classList.add(`${BLOCK}--shown`);
    }
    panel.innerHTML = dictionary.template({ loading: true });

    const templateData = {
      loading: false,
      notFound: null,
      error: false,
      data: null,
    };
    search(word, DEFAULT_LANG)
      .then((result: SearchResult) => {
        const { error, data } = result;
        if (error === 0) {
          panel.innerHTML = dictionary.template({
            ...templateData,
            notFound: word,
          });
        } else if (error) {
          panel.innerHTML = dictionary.template({
            ...templateData,
            error,
          });
        } else if (data) {
          console.log(data);
          panel.innerHTML = dictionary.template({
            ...templateData,
            data,
          });
        }
      });

    createPopper(
      selection?.getRangeAt(0),
      panel,
      {},
    );

    window.addEventListener('mousedown', dictionary.onMouseDown);
  },

  onMouseDown: (event: MouseEvent) => {
    const { panel } = dictionary;
    const target = event.target as HTMLElement
    if (target && panel && panel !== target && !panel.contains(target)) {
      panel.classList.remove(`${BLOCK}--shown`);
      window.removeEventListener('mousedown', dictionary.onMouseDown);
    }
  },

  getDefinitionPanel() {
    if (!dictionary.panel) {
      dictionary.panel = document.createElement('div');
      dictionary.panel.className = 'extension-handy-dictionary';

      // @ts-ignore Handlebars will be defined globally.
      dictionary.template = Handlebars.compile(TEMPLATE);

      document.body.appendChild(dictionary.panel);
    }
    return dictionary.panel;
  },

  init: () => {
    browser.runtime.onMessage.addListener(dictionary.handleContextMenuClick);
  },
};

dictionary.init();
