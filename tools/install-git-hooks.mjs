import { execFileSync, spawnSync } from 'node:child_process';

const inside = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { encoding: 'utf8' });
if (inside.status !== 0) process.exit(0);
const existing = spawnSync('git', ['config', '--local', '--get', 'core.hooksPath'], { encoding: 'utf8' }).stdout.trim();
if (existing && existing !== '.githooks') {
  console.error('Custom Git hooks are already configured. Integrate .githooks before committing or pushing.');
  process.exit(1);
}
execFileSync('git', ['config', '--local', 'core.hooksPath', '.githooks']);
console.log('Private-path and secret checks installed for commit and push.');
