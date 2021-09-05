const BLOCK = APP_ID;

const TEMPLATE = `
  <div class="${BLOCK}__content">
    <div class="${BLOCK}__content-scroll">
      {{#if loading}}
        Loading...
      {{else if notFound}}
        <strong>{{notFound}}</strong> was not found.
      {{else if error}}
        Uh oh! An error occurred. Please try again later.
      {{else}}
        {{#each data}}
          <div class="${BLOCK}__entry">

            <div class="${BLOCK}__title-block">
              <h3 class="${BLOCK}__term">{{this.word}}</h3>
              {{#each this.phonetics}}
                {{#if this.audio}}
                  <button ${AUDIO_TRACK}="{{this.audio}}" class="${BLOCK}__phonetic ${BLOCK}__phonetic-play" title="Listen">
                    <span class="${BLOCK}__phonetic-text">{{this.text}}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                  </button>
                {{else}}
                  <span class="${BLOCK}__phonetic ${BLOCK}__phonetic-text">
                    {{this.text}}
                  </span>
                {{/if}}
              {{/each}}
            </div>

            <div class="${BLOCK}__meanings">
              {{#each this.meanings}}
                <p class="${BLOCK}__part-of-speech">{{this.partOfSpeech}}</p>
                <ol>
                {{#each this.definitions}}
                  <li>
                    {{this.definition}}
                    {{#if this.example}}
                      <em class="${BLOCK}__example">{{this.example}}</em>
                    {{/if}}
                    {{#if this.synonyms}}
                      <p class="${BLOCK}__synonyms">
                        <span class="${BLOCK}__synonyms-label">Synonyms:</span>
                        {{#each this.synonyms}}
                          <span class="${BLOCK}__synonyms-item">{{this}}</span>
                        {{/each}}
                      </p>
                    {{/if}}
                  </li>
                {{/each}}
                </ol>
              {{/each}}
            </div>
          </div>
        {{/each}}

        <p class="${BLOCK}__csp">
          Audio of this word's pronunciation has been disabled by a content security policy on this website.
        </p>
      {{/if}}
    </div>
  </div>
  <div class="${BLOCK}__status-bar">
    <a href="{{search.href}}" target="${BLOCK}-{{search.key}}">
      Look up on {{search.label}}
    </a>
  </div>
`;
