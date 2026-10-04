# Pi Themes

> A curated theme pack for [Pi](https://github.com/earendil-works/pi): **68 terminal themes**, a fast `/themes` picker, and zero setup beyond one install.

```sh
pi install npm:@anishthite/pi-themes
```

Then start Pi and run `/themes` to browse, or select one directly:

```text
/themes opencode-tokyonight-dark
```

Your pick changes the current session. Use Pi’s `/settings` command to make it your default.

## What's inside

| Collection | Themes | Highlights |
| --- | ---: | --- |
| OpenCode | 66 | Every bundled OpenCode TUI palette, in dark and light variants |
| Whip | 2 | Neon City Dark and Seti |

### Start here

| Mood | Theme |
| --- | --- |
| Familiar and calm | `opencode-github-dark` |
| Purple after-hours | `opencode-tokyonight-dark` |
| Warm and low-contrast | `opencode-everforest-dark` |
| High-energy neon | `whip-neon-city-dark` |
| Crisp and classic | `whip-seti` |

Every OpenCode theme uses the name `opencode-<name>-<dark|light>`. For instance, pair `opencode-github-light/opencode-github-dark` in Pi’s Theme setting to follow your terminal appearance automatically.

<details>
<summary>Browse the OpenCode collection</summary>

`aura`, `ayu`, `carbonfox`, `catppuccin`, `catppuccin-frappe`, `catppuccin-macchiato`, `cobalt2`, `cursor`, `dracula`, `everforest`, `flexoki`, `github`, `gruvbox`, `kanagawa`, `lucent-orng`, `material`, `matrix`, `mercury`, `monokai`, `nightowl`, `nord`, `one-dark`, `opencode`, `orng`, `osaka-jade`, `palenight`, `rosepine`, `solarized`, `synthwave84`, `tokyonight`, `vercel`, `vesper`, `zenburn`.
</details>

## Local development

Try the package without installing it:

```sh
pi --extension ./extensions/index.ts --theme ./themes --use-theme whip-seti
```

Add custom palettes as `themes/<name>.json`; the JSON `name` must match its filename and validate against [Pi’s theme schema](https://raw.githubusercontent.com/earendil-works/pi/main/packages/coding-agent/src/modes/interactive/theme/theme-schema.json).

## Release

```sh
bun run release
```

The local Bun script publishes to npm, creates and pushes `v<version>`, and generates GitHub release notes. Preview it with `bun run release -- --dry-run`; bump `package.json` first.

## Credits

OpenCode palettes come from [`anomalyco/opencode`](https://github.com/anomalyco/opencode) at `907b3bc` (MIT). Neon City Dark and Seti come from [Whip PR #285](https://github.com/context-labs/whip/pull/285) at `e76b337` (Apache-2.0). See [`NOTICE`](NOTICE) for details.
