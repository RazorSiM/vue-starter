import type { ChangelogConfig } from 'changelogen'

// Loaded by changelogen through c12. The defaults already match this repo's
// history — `chore(release): vX.Y.Z` commits, `vX.Y.Z` tags, CHANGELOG.md output
// and the emoji section titles used since v3.0.0 — so only the deviations live here.
//
// The repo URL behind the compare/commit links comes from package.json's
// `repository` field; do not duplicate it as `repo` here.
//
// Nothing is ever published to npm: package.json is `private: true`, so a release
// is purely bump + changelog + commit + tag + GitHub release.
export default {
  // v3.0.0's entry leaked a raw `<me@raz.works>` into the contributors list for
  // commits authored without a linked GitHub account. Keep the names, drop the mails.
  hideAuthorEmail: true,
} satisfies Partial<ChangelogConfig>
