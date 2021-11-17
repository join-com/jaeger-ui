# jagger-generate-graph

Generate png from graph, built with [Playwright][playwright]

```sh
cat data/exampleTrace.json | node ./cli.js --width 5600 --height 2400 --out-dir assets
```

```
Usage
  $ jagger-generate-graph <ReactComponent>

Options
  -d --out-dir    Directory to save file to
  -f --filename   Specify a custom output filename
  -w --width      Width of image
  -h --height     Height of image
  -p --props      Props in JSON format (or path to JSON file) to pass to the React component
  -t --type       Type of output (png default) (pdf, jpeg or png)
  --launcher      Options for browser launcher in JSON format
```

### Related

- [Playwright][playwright]

MIT License

[playwright]: https://playwright.dev/
