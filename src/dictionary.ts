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

    const panel = dictionary.getDefinitionPanel();
    if (!panel.classList.contains(`${BLOCK}--shown`)) {
      panel.classList.add(`${BLOCK}--shown`);
    }
    panel.innerHTML = dictionary.template({ loading: true });

    search(message.selectionText || '', DEFAULT_LANG)
      .then((result: SearchResult) => {
        const { error, data } = result;
        if (error) {
          panel.innerHTML = dictionary.template({ loading: false, error });
        } else if (data) {
          panel.innerHTML = dictionary.template({ loading: false, error: false, data });
        }
      });

    createPopper(
      window.getSelection()?.getRangeAt(0),
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
