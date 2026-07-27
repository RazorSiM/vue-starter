{ pkgs, lib, ... }:

{
  packages = [ pkgs.git ];

  # Node 26 + pnpm, both from nixpkgs.
  #
  # Corepack is intentionally not used: it was unbundled from Node, so it does
  # not exist in Node 26. pnpm comes from nixpkgs and is the only package
  # manager on PATH. Keep package.json's `packageManager` field in sync with
  # the pnpm version below so pnpm's own version self-check is a no-op.
  #
  # Heads-up: `node` on PATH resolves to nodejs-slim (devenv's javascript module
  # takes precedence over `packages`). Same upstream version, just built without
  # a bundled npm — harmless here, since this repo uses pnpm exclusively.
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_26;
    pnpm.enable = true;
  };

  # Playwright on NixOS: the browsers Playwright downloads itself are linked
  # against FHS paths that do not exist here, so point it at the prebuilt,
  # patchelf'd bundle from nixpkgs instead.
  #
  # Browser revisions are matched per Playwright release and Playwright hard-errors
  # on a mismatch ("Executable doesn't exist at ..."), so @playwright/test must be
  # pinned to EXACTLY pkgs.playwright-driver.version — no caret. enterShell below
  # guards against drift in either direction.
  env = {
    PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
  };

  # devenv's git-hooks integration is deliberately left untouched. This repo
  # manages hooks with lefthook. Enabling any `git-hooks.hooks.<name>.enable`
  # would write .git/hooks/pre-commit and silently clobber lefthook's hook on
  # the next `devenv shell`.

  enterShell = ''
    echo "vue-starter  ·  node $(node --version)  ·  pnpm $(pnpm --version)"

    nixPw="${pkgs.playwright-driver.version}"
    npmPw="$(${lib.getExe pkgs.jq} -r '.devDependencies["@playwright/test"] // empty' package.json 2>/dev/null)"
    if [ -n "$npmPw" ] && [ "$npmPw" != "$nixPw" ]; then
      echo ""
      echo "  WARNING: @playwright/test is pinned to '$npmPw' but the nixpkgs"
      echo "           browser bundle is $nixPw. e2e will fail with"
      echo "           \"Executable doesn't exist\". Align the two."
    fi
  '';
}
