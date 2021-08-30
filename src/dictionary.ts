const dictionary = {
  handleContextMenuClick: (message: { selectionText?: string }) => {
    console.dir(message);
    console.log(window.getSelection()?.getRangeAt(0).getBoundingClientRect());

    // @ts-ignore Popper will be defined globally.
    const { createPopper } = Popper;

    createPopper(
      window.getSelection()?.getRangeAt(0),
      dictionary.getDefinitionPanel(),
      {},
    );
  },

  getDefinitionPanel() {
    const el = document.createElement('div');
    el.style.background = 'red';
    el.style.width = '100px';
    el.style.height = '100px';

    // @ts-ignore Handlebars will be defined globally.
    const template = Handlebars.compile('<p>Handlebars <b>{{what}}</b></p>');

    el.innerHTML = template({ what: 'works, hopefully' });

    document.body.appendChild(el);
    return el;
  },

  init: () => {
    browser.runtime.onMessage.addListener(dictionary.handleContextMenuClick);
  },
};

dictionary.init();
