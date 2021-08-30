interface Window {
  onContextMenuClick: (data: any) => void;
  dictionaryBackground: any;
}

const dictionary = {
  handleContextMenuClick: (message: { selectionText?: string }) => {
    console.dir(message);
    console.log(window.getSelection()?.getRangeAt(0).getBoundingClientRect());
  },

  init: () => {
    browser.runtime.onMessage.addListener(dictionary.handleContextMenuClick);
  },
};

dictionary.init();
