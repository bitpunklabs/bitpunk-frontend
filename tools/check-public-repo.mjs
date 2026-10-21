// Fail closed on private paths and secrets; never print credential values.
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const policy = JSON.parse(readFileSync(new URL('../.privacy-policy.json', import.meta.url), 'utf8'));
const staged = process.argv.includes('--staged');
const history = process.argv.includes('--history');
const git = args => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const isPrivateEmail = email => !/^[^@\s]+@users\.noreply\.github\.com$/i.test(email.trim());
if (staged) {
  const identities = ['GIT_AUTHOR_IDENT', 'GIT_COMMITTER_IDENT'].map(name => git(['var', name]));
  if (identities.some(value => isPrivateEmail(value.match(/<([^<>]+)>/)?.[1] || ''))) {
    console.error('BLOCKED: configure a GitHub noreply identity before committing. Personal email values are not printed.');
    process.exit(1);
  }
}
if (history && git(['log', '--all', '--format=%ae%n%ce']).split('\n').filter(Boolean).some(isPrivateEmail)) {
  console.error('BLOCKED: reachable commit metadata contains non-noreply email addresses. Clean author and committer identities before publishing.');
  process.exit(1);
}
const normalise = value => value.replaceAll('\\', '/').replace(/^\.\//, '');
function isPrivate(input) {
  const path = normalise(input);
  if (policy.privateRoots.some(root => path === root || path.startsWith(root + '/'))) return true;
  if (policy.privateFiles.includes(path)) return true;
  if (/(^|\/)\.env(?:\.|$)/i.test(path) && path !== '.env.example') return true;
  if (/(^|\/)(?:id_rsa|id_ed25519)(?:\.|$)/.test(path)) return true;
  return policy.privateExtensions.includes(path.split('.').at(-1).toLowerCase());
}
const indexFiles = staged
  ? git(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z']).split('\0')
  : git(['ls-files', '-z']).split('\0');
const paths = new Set(indexFiles.filter(Boolean));
if (history) {
  for (const path of git(['log', '--all', '--format=', '--name-only', '--no-renames', '-z']).split('\0')) {
    if (path.trim()) paths.add(path.trim());
  }
}
const rejected = [...paths].filter(isPrivate).sort();
if (rejected.length) {
  console.error(`BLOCKED: ${rejected.length} private paths exist in ${history ? 'reachable history or the index' : 'the index'}.`);
  for (const path of rejected.slice(0, 15)) console.error(`  ${path}`);
  process.exit(1);
}
const args = ['git', '.', '--redact=100', '--no-banner', '--no-color', '--report-format=json', '--report-path=-'];
if (staged) args.push('--pre-commit', '--staged');
else args.push('--log-opts=--all');
const scan = spawnSync('gitleaks', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
if (scan.error || scan.status !== 0) {
  console.error('BLOCKED: secret scan did not pass. Install Gitleaks and resolve the redacted findings.');
  try {
    for (const finding of JSON.parse(scan.stdout || '[]')) {
      console.error(`  ${finding.File}:${finding.StartLine} (${finding.RuleID})`);
    }
  } catch { /* Scanner errors are kept out of public output. */ }
  process.exit(1);
}
console.log(`PASS: ${history ? 'reachable history and index' : 'staged files'} contain no blocked paths or detected secrets.`);
