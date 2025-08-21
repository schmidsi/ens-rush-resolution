# Rush Resolution - Project Handover

## Overview
Building "Rush Resolution" - a rapid ENS resolution service that trades security for speed. The name intentionally implies the speed/security tradeoff ("rushing" = sloppy/cutting corners).

## Core Concept
A simple `<script>` tag that automatically finds all Ethereum addresses on a page and resolves them to ENS names. Perfect for static sites, blogs, and dashboards where cryptographic verification isn't critical.

## Technical Decisions

### API Backend
Using Greg Skril's ENS API (https://github.com/gskril/ens-api)
- Default endpoint: `https://ens-api.gregskril.com`
- Endpoints:
  - GET `/address/:address` - Get primary ENS name for address
  - GET `/name/:name` - Get profile for ENS name
  - POST `/batch/addresses` - Resolve multiple addresses (body: `{addresses: []}`)
  - POST `/batch/names` - Resolve multiple names (body: `{names: []}`)
- Should be configurable but default to Greg's instance

### Tech Stack
- **Bun**: Package manager, test runner, workspace management
- **Vite** or **tsup**: For bundling/building
- **TypeScript**: Throughout

### Development Strategy
Start minimal, build incrementally:

1. **Phase 1**: Core resolution function
   - Simple `resolve()` function that takes an array of addresses
   - Returns array of address → name mappings
   - Uses batch endpoint for efficiency

2. **Phase 2**: Auto-detection script
   - `<script>` tag that auto-detects addresses on page
   - Uses the core resolve function
   - Basic implementation, no fancy features

3. **Phase 3**: Add MutationObserver
   - Watch for dynamically added content
   - Support SPAs and client-side rendering

4. **Phase 4**: Framework integrations
   - React hooks and components
   - Vue directives
   - Other frameworks as needed

## Project Structure (Future)
```
rush-resolution/
├── packages/
│   ├── core/          # Resolution logic only
│   ├── observer/      # DOM watching (separate for tree-shaking)
│   ├── react/         # React-specific integrations
│   └── cdn/           # Bundled version for script tags
└── examples/
    └── vanilla/       # Start here!
```

## Next Steps
1. Create minimal `resolve()` function that accepts array of addresses
2. Use `/batch/addresses` endpoint for efficiency
3. Return simple array of mappings
4. Test with real addresses
5. Only then build the auto-detection layer on top

## Key Principles
- Less is more
- Ship something minimal first
- Get feedback before adding complexity
- Don't over-engineer the initial version