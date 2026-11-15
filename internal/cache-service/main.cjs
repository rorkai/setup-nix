const fs = require('node:fs');

const endpoint = process.env.ACTIONS_RESULTS_URL;
const githubCache = endpoint
  ? new URL(endpoint).hostname.endsWith('.actions.githubusercontent.com')
  : false;

fs.appendFileSync(process.env.GITHUB_OUTPUT, `github-cache=${githubCache}\n`);
console.log(`GitHub cache REST inventory checks: ${githubCache ? 'enabled' : 'disabled'}`);
