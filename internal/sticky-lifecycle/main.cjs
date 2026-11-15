const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

const state = fs.readFileSync('/proc/1/comm', 'utf8').trim() === 'systemd'
  ? { mode: 'systemd' }
  : (() => {
      const pid = execFileSync('pgrep', ['--oldest', '--exact', 'nix-daemon'], { encoding: 'utf8' }).trim();
      const stat = fs.readFileSync(`/proc/${pid}/stat`, 'utf8');
      const fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
      return { mode: 'manual', pid, start: fields[19] };
    })();

fs.appendFileSync(process.env.GITHUB_STATE, `daemon=${JSON.stringify(state)}\n`);
