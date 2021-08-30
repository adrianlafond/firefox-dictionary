const dictionaryBackground = {
  init: () => {
    browser.contextMenus.create({
      id: APP_ID,
      title: 'Look up in Handy',
      contexts: ['selection'],
    });

    // menuItemId: string | number;
    browser.contextMenus.onClicked.addListener((data: any, tab?: { id?: number }) => {
      if (data.menuItemId === APP_ID) {
        browser.tabs.sendMessage(tab?.id || 0, data);
      }
    });
  },
};

dictionaryBackground.init();
