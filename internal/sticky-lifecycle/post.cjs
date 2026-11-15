const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const { setTimeout } = require('node:timers/promises');

function currentProcess(pid) {
  try {
    const stat = fs.readFileSync(`/proc/${pid}/stat`, 'utf8');
    const fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
    return { state: fields[0], start: fields[19] };
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
}

async function main() {
  if (!process.env.STATE_daemon) return;
  const daemon = JSON.parse(process.env.STATE_daemon);
  if (daemon.mode === 'systemd') {
    execFileSync('sudo', ['systemctl', 'stop', 'nix-daemon.socket', 'nix-daemon.service'], {
      stdio: 'inherit',
      timeout: 30000,
    });
    return;
  }

  const active = currentProcess(daemon.pid);
  if (!active || active.start !== daemon.start || active.state === 'Z') return;
  execFileSync('sudo', ['kill', '-TERM', daemon.pid], { stdio: 'inherit' });
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    const current = currentProcess(daemon.pid);
    if (!current || current.start !== daemon.start || current.state === 'Z') return;
    await setTimeout(50);
  }
  throw new Error('The owned Nix daemon did not stop before sticky disk unmount');
}

main().catch((error) => {
  console.error(`::error::${error.message}`);
  process.exitCode = 1;
});
