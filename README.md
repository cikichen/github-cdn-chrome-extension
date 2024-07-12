# GitHub Raw to CDN Converter

A Chrome extension to convert GitHub raw URLs to various CDN links. This tool helps you quickly generate CDN links for your GitHub-hosted files, making it easier to include them in web projects.

## Features

- Convert GitHub raw URLs to CDN links
- Supports multiple CDN providers:
  - jsDelivr
  - RawGitHack
  - Statically
  - GHProxy
  - Fastly
- Add and manage custom CDN templates
- Copy generated links to clipboard with one click

## Installation

1. Clone this repository or download the ZIP file.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" by toggling the switch in the top right corner.
4. Click "Load unpacked" and select the directory where you cloned or extracted this repository.

## Usage

1. Open the extension by clicking the icon in the Chrome toolbar.
2. Enter a GitHub raw URL in the input field (e.g., `https://raw.githubusercontent.com/user/repo/branch/path/to/file`).
3. Click the "Convert to CDN Links" button.
4. The generated CDN links will be displayed. Click "Copy" next to any link to copy it to the clipboard.

### Adding Custom CDN Templates

1. Enter a custom CDN template in the "Add Custom CDN Template" input field. Use `{user}`, `{repo}`, `{branch}`, `{path}`, and `{commit}` as placeholders.
2. Click the "Add Custom CDN" button to save the template.
3. Your custom CDN templates will be displayed in the list below, and you can remove them by clicking "Remove".

## Examples

**GitHub Raw URL:**
```
https://raw.githubusercontent.com/user/repo/branch/path/to/file
```

**Generated CDN Links:**
- `https://cdn.jsdelivr.net/gh/user/repo@branch/path/to/file`
- `https://rawcdn.githack.com/user/repo/commit/path/to/file`
- `https://cdn.statically.io/gh/user/repo/branch/path/to/file`
- `https://mirror.ghproxy.com/raw.githubusercontent.com/user/repo/branch/path/to/file`
- `https://ghproxy.net/https://raw.githubusercontent.com/user/repo/branch/path/to/file`
- `https://fastly.jsdelivr.net/gh/user/repo@branch/path/to/file`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.