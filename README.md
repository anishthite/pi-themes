# Pi Themes

A Pi package that ships theme JSON files and adds `/themes` for switching the current session's theme.

## Try locally

```sh
pi --extension ./extensions/index.ts
```

Run `/themes` to open the picker or `/themes <name>` to select one directly. `/settings` persists the choice for future sessions.

## OpenCode collection

This package ports all 33 OpenCode bundled TUI themes from [`anomalyco/opencode`](https://github.com/anomalyco/opencode) commit `907b3bc` (the source is MIT licensed). Each source palette becomes `opencode-<name>-dark` and `opencode-<name>-light`, for 66 Pi themes.

`aura`, `ayu`, `carbonfox`, `catppuccin`, `catppuccin-frappe`, `catppuccin-macchiato`, `cobalt2`, `cursor`, `dracula`, `everforest`, `flexoki`, `github`, `gruvbox`, `kanagawa`, `lucent-orng`, `material`, `matrix`, `mercury`, `monokai`, `nightowl`, `nord`, `one-dark`, `opencode`, `orng`, `osaka-jade`, `palenight`, `rosepine`, `solarized`, `synthwave84`, `tokyonight`, `vercel`, `vesper`, `zenburn`.

Pi has no dedicated diff-background roles, so those OpenCode colors map to the nearest Pi semantic roles.

## Whip collection

This package also ports `whip-neon-city-dark` and `whip-seti` from [Whip PR #285](https://github.com/context-labs/whip/pull/285) at `e76b337`. The source is Apache-2.0 licensed.

## Add a theme

Put `<name>.json` in `themes/`. Its `name` must match its filename and conform to Pi's theme schema:

```json
{
  "$schema": "https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json",
  "name": "my-theme",
  "colors": {}
}
```

Validate the complete palette against Pi's schema before adding it. Pi discovers package themes automatically.

## Release

Run the local Bun release script. It publishes to npm, creates and pushes `v<version>`, then creates GitHub release notes.

```sh
bun run release
```

Preview it first with `bun run release -- --dry-run`. Bump the version in `package.json` before the next release.

## Install

```sh
pi install npm:@anishthite/pi-themes
```
