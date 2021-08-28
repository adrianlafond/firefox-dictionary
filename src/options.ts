function onSelectLangInput(event: Event) {
  const { value } = event.target as HTMLSelectElement;
  browser.storage.local.set({ lang: value });
}

function initSelectLang(lang: string) {
  const selectLang: HTMLSelectElement | null = document.querySelector('select[name=lang]');
  if (selectLang) {
    for (let i = 0; i < selectLang.options.length; i++) {
      if (selectLang.options[i].value === lang) {
        selectLang.options[i].selected = true;
        break;
      }
    }
    selectLang.addEventListener('input', onSelectLangInput);
  }
}

function destroySelectLang() {
  const selectLang: HTMLSelectElement | null = document.querySelector('select[name=lang]');
  if (selectLang) {
    selectLang.removeEventListener('input', onSelectLangInput);
  }
}

function destroy() {
  destroySelectLang();
  window.removeEventListener('pagehide', destroy);
}

function init() {
  browser.storage.local.get({ lang: 'en' })
    .then((record: Record<string, any>) => {
      initSelectLang(record.lang);
    });
  window.addEventListener('pagehide', destroy);
}

init();
