# ENS Rush Resolution

A rapid ENS resolution service that trades security for speed. Perfect for static sites, blogs, and dashboards where cryptographic verification isn't critical.

## Overview

Rush Resolution automatically finds Ethereum addresses on web pages and resolves them to ENS names using a simple `<script>` tag. The name intentionally implies the speed/security tradeoff ("rushing" = cutting corners for performance).

## Quick Start

Add this single line to your HTML `<head>`:

```html
<script src="https://unpkg.com/@ens-rush-resolution/auto-resolve/dist/index.global.js"></script>
```

That's it! All Ethereum addresses on your page will automatically be replaced with their ENS names.

## Packages

- **[@ens-rush-resolution/core](./packages/core/)** - Core resolution logic
- **[@ens-rush-resolution/auto-resolve](./packages/auto-resolve/)** - Auto-detection and DOM replacement

## Examples

- **[Node.js](./examples/nodejs/)** - Programmatic usage of the core package
- **[Vanilla HTML](./examples/vanilla-html/)** - Simple HTML page with auto-resolution

## Development

This project uses [Bun](https://bun.sh) as the package manager and workspace tool.

### Setup

```bash
bun install
```

### Build

```bash
# Build all packages
bun run build

# Build specific package
bun run --cwd packages/core build
```

### Test

```bash
# Run all tests
bun run test

# Test specific package
bun run --cwd packages/core test
```

### Development Server

```bash
# Start demo server
cd examples/vanilla-html
bun run serve
```

Then open http://localhost:3000

## How It Works

1. **Detection**: Scans the DOM for Ethereum addresses using regex
2. **Resolution**: Batches addresses and resolves them via [ENS API](https://github.com/gskril/ens-api)
3. **Replacement**: Updates the DOM with ENS names, keeping original addresses as hover tooltips

## Configuration

The auto-resolve script runs automatically when loaded. For custom configuration:

```javascript
import { autoResolve } from '@ens-rush-resolution/auto-resolve';

autoResolve({
  apiEndpoint: 'https://your-ens-api.com', // Custom ENS API
  selector: '.content',                     // Limit to specific element
  onResolve: (address, name, element) => { // Custom callback
    console.log(`${address} → ${name}`);
  }
});
```

### Excluding Sections from Resolution

Use the `data-ens-rush="false"` attribute to prevent auto-resolution in specific sections:

```html
<!-- Skip resolution in code examples -->
<pre data-ens-rush="false">
  <code>Contact: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045</code>
</pre>

<!-- Skip entire sections -->
<div data-ens-rush="false">
  <p>This address won't be resolved: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045</p>
  <span>Neither will this: 0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5</span>
</div>
```

This is perfect for:
- Code examples and documentation
- Technical specifications
- Any content where original addresses should be preserved

## API Reference

### Core Package

```javascript
import { resolve } from '@ens-rush-resolution/core';

const results = await resolve([
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'  // vitalik.eth
]);

console.log(results[0].name); // "vitalik.eth"
```

### Auto-Resolve Package

```javascript
import { autoResolve } from '@ens-rush-resolution/auto-resolve';

// Auto-resolve all addresses on the page
await autoResolve();

// With options
await autoResolve({
  selector: '#main-content',
  onResolve: (address, name, element) => {
    if (name) {
      console.log(`Resolved ${address} to ${name}`);
    }
  }
});
```

## Roadmap

- [x] **Phase 1**: Core resolution function
- [x] **Phase 2**: Auto-detection script  
- [ ] **Phase 3**: MutationObserver for dynamic content
- [ ] **Phase 4**: Framework integrations (React, Vue, etc.)

## Contributing

This project follows the "less is more" philosophy. We ship minimal, working solutions first, then add complexity based on feedback.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Acknowledgments

- Built on [Greg Skril's ENS API](https://github.com/gskril/ens-api)
- Powered by [Bun](https://bun.sh) and [tsup](https://tsup.egoist.dev)