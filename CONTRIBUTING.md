# Contributing

## Themes

1. Open an issue with the theme source and its license before submitting a port.
2. Add each variant as `themes/<name>-dark.json` or `themes/<name>-light.json`.
3. Keep the JSON compatible with Pi's theme schema and use the existing theme names as a guide.
4. Update `NOTICE` and add the upstream license to `LICENSES/` when the source requires attribution or redistribution.

Validate all themes before opening a pull request:

```sh
bun -e 'for (const path of new Bun.Glob("themes/*.json").scanSync()) JSON.parse(await Bun.file(path).text())'
```

## Pull requests

Keep changes focused, describe the source and license for new themes, and do not add generated files. By submitting a contribution, you license it under this repository's MIT License.
