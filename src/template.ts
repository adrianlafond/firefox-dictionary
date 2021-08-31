const BLOCK = 'extension-handy-dictionary';

const TEMPLATE = `
  {{#if loading}}
    Loading...
  {{else if notFound}}
    <strong>{{notFound}}</strong> was not found.
  {{else if error}}
    Uh oh! An error occurred. Please try again later.
  {{else}}
    {{#each data}}
      <p>{{this.word}}</p>
    {{/each}}
  {{/if}}
  <div class="${BLOCK}__status-bar">
    Status Bar
  </div>
`;