const fs = require('node:fs');

const endpoint = process.env.ACTIONS_RESULTS_URL;
const blacksmith = Object.entries(process.env).some(([key, value]) => key.startsWith('BLACKSMITH_') && value);
const githubCache = endpoint && !blacksmith
  ? new URL(endpoint).hostname.endsWith('.actions.githubusercontent.com')
  : false;

fs.appendFileSync(process.env.GITHUB_OUTPUT, `github-cache=${githubCache}\n`);
console.log(`GitHub cache REST inventory checks: ${githubCache ? 'enabled' : 'disabled'}`);
