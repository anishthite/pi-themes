# Pi Themes

**69 themes for [Pi](https://github.com/earendil-works/pi), with a built-in picker.**

## Install

```sh
pi install npm:@anishthite/pi-themes
```

[Request a theme](https://github.com/anishthite/pi-themes/issues/new?template=theme-request.md&title=Theme+request%3A+) if your favorite is missing.

Restart Pi, then run:

```text
/themes
```

`/themes` always opens the picker; add a theme name to start on it. The current terminal appearance is listed first, with `Dark themes` and `Light themes` labels, so navigation stays within one appearance:

```text
/themes tokyonight-dark
```

Save the selected theme for future Pi sessions without opening `/settings`:

```text
/themes set
```

Arrow through the list to preview each palette across Pi; press Enter to keep it or Escape to restore your current theme. Press `b` to toggle terminal-background previews. The preference is saved in `~/.pi/agent/pi-themes.json`; it uses OSC 11, so only terminals that support OSC 11 will change. You can also set it before opening the picker:

```text
/themes background on
/themes background off
```

## Save your choice

`/themes` changes the current session. To use a theme every time, open `/settings` in Pi and set **Theme** to its name.

To follow your terminal’s light/dark appearance, set Theme to a pair:

```text
github-light/github-dark
```

## Theme catalog

### 66 paired themes

Each name below is available in **both** `-dark` and `-light` forms. For example, `dracula-dark` and `dracula-light`.

|  |  |  |
| --- | --- | --- |
| `aura` | `ayu` | `carbonfox` |
| `catppuccin` | `catppuccin-frappe` | `catppuccin-macchiato` |
| `cobalt2` | `cursor` | `dracula` |
| `everforest` | `flexoki` | `github` |
| `gruvbox` | `kanagawa` | `lucent-orng` |
| `material` | `matrix` | `mercury` |
| `monokai` | `nightowl` | `nord` |
| `one-dark` | `default` | `orng` |
| `osaka-jade` | `palenight` | `rosepine` |
| `solarized` | `synthwave84` | `tokyonight` |
| `vercel` | `vesper` | `zenburn` |

### Three more themes

- `dark-abyss-dark`
- `neon-city-dark`
- `seti`
