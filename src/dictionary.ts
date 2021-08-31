type PanelType = HTMLDivElement | null;

const dictionary: {
  panel: PanelType;
  template: any;
  className: string;
  handleContextMenuClick: (message: { selectionText?: string }) => void;
  onMouseDown: (event: MouseEvent) => void;
  getDefinitionPanel(): HTMLDivElement;
  init: () => void;
} = {
  panel: null,
  template: null,
  className: 'extension-handy-dictionary',

  handleContextMenuClick: () => {
    // @ts-ignore Popper will be defined globally.
    const { createPopper } = Popper;

    const panel = dictionary.getDefinitionPanel();
    if (!panel.classList.contains(`${dictionary.className}--shown`)) {
      panel.classList.add(`${dictionary.className}--shown`);
    }
    panel.innerHTML = dictionary.template({ what: 'works, hopefully' });

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
      panel.classList.remove(`${dictionary.className}--shown`);
      window.removeEventListener('mousedown', dictionary.onMouseDown);
    }
  },

  getDefinitionPanel() {
    if (!dictionary.panel) {
      dictionary.panel = document.createElement('div');
      dictionary.panel.className = 'extension-handy-dictionary';

      // @ts-ignore Handlebars will be defined globally.
      dictionary.template = Handlebars.compile('<p>Handlebars <b>{{what}}</b></p>');

      document.body.appendChild(dictionary.panel);
    }
    return dictionary.panel;
  },

  init: () => {
    browser.runtime.onMessage.addListener(dictionary.handleContextMenuClick);
  },
};

dictionary.init();
