function onSelectSearchInput(event: Event) {
  const { value } = event.target as HTMLSelectElement;
  browser.storage.local.set({ search: value });
  toggleInputSearch(value === 'other');
}

function onInputSearchInput(event: Event) {
  browser.storage.local.set({ searchUrl: (event.target as HTMLInputElement).value });
}

function onInputSearchKeyUp(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    (event.target as HTMLInputElement).blur();
  }
}

function initInputSearch(value: string, enabled = false) {
  const input: HTMLInputElement | null = document.querySelector(`input[name=search-url]`);
  if (input) {
    browser.storage.local.set({ searchUrl: input.value });
    input.value = value;
    input.addEventListener('input', onInputSearchInput);
    input.addEventListener('keyup', onInputSearchKeyUp);
    toggleInputSearch(enabled, input);
  }
}

function destroyInputSearch() {
  const input: HTMLInputElement | null = document.querySelector(`input[name=search-url]`);
  if (input) {
    input.classList.remove('dict-opts__search-url--shown');
    input.removeEventListener('input', onInputSearchInput);
    input.removeEventListener('keyup', onInputSearchKeyUp);
  }
}

function toggleInputSearch(enabled: boolean, input?: HTMLInputElement) {
  const el = input || document.querySelector(`input[name=search-url]`);
  if (el) {
    el.classList[enabled ? 'add' : 'remove']('dict-opts__search-url--shown');
  }
}

function initSelect(name: string, value: string, onInput: (event: Event) => void) {
  const select: HTMLSelectElement | null = document.querySelector(`select[name=${name}]`);
  if (select) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === value) {
        select.options[i].selected = true;
        break;
      }
    }
    select.addEventListener('input', onInput);
  }
}

function destroySelect(name: string, onInput: (event: Event) => void) {
  const select: HTMLSelectElement | null = document.querySelector(`select[name=${name}]`);
  if (select) {
    select.removeEventListener('input', onInput);
  }
}

function onResetClick() {
  browser.storage.local.clear().then(() => {
    destroyOptions();
    initOptions();
  });
}

function initReset() {
  const button: HTMLButtonElement | null = document.querySelector('button[name=reset]');
  if (button) {
    button.addEventListener('click', onResetClick);
  }
}

function destroyReset() {
  const button: HTMLButtonElement | null = document.querySelector('button[name=reset]');
  if (button) {
    button.removeEventListener('click', onResetClick);
  }
}

function destroyOptions() {
  destroySelect('search', onSelectSearchInput);
  destroyInputSearch();
  destroyReset();
  window.removeEventListener('pagehide', destroyOptions);
}

function initOptions() {
  browser.storage.local.get({
      lang: 'en',
      search: 'ecosia',
      searchUrl: '',
    })
    .then((record: Record<string, any>) => {
      initSelect('search', record.search, onSelectSearchInput);
      initInputSearch(record.searchUrl, record.search === 'other');
      initReset();
    });
  window.addEventListener('pagehide', destroyOptions);
}

initOptions();
