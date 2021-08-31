const BLOCK = 'extension-handy-dictionary';

const TEMPLATE = `
  {{#if loading}}
    Loading...
  {{else if error}}
    {{error}}
  {{else}}
    {{#each data}}
      {{this.word}}
    {{/each}}
  {{/if}}
  <div class="${BLOCK}__status-bar">
    Status Bar
  </div>
`;