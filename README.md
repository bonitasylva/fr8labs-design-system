# Fr8Labs Design System

Fr8Labs Design System (FDS) provides reusable React components, tokens, icons, freight-workflow examples, Storybook documentation, and a read-only MCP catalog.

The current public packages are pre-1.0 releases for browser-based React applications:

| Package | Version | Purpose |
| --- | --- | --- |
| `sandbox-fds-components` | `0.2.0` | React components and bundled FDS styles |
| `sandbox-fds-icons` | `0.1.1` | React icon helpers and icon styles |
| `sandbox-fds-tokens` | `0.2.0` | Framework-neutral CSS custom properties |

## Install all FDS packages

```sh
npm install sandbox-fds-components sandbox-fds-icons sandbox-fds-tokens
```

This installs the complete FDS package surface: React components, icons, and framework-neutral tokens.

```tsx
import {Button, FdsProvider} from 'sandbox-fds-components';
import {Icon} from 'sandbox-fds-icons';
import 'sandbox-fds-components/styles.css';

<FdsProvider>
  <Button startIcon={<Icon name="download" />}>Export shipment</Button>
</FdsProvider>
```

See the [component package guide](packages/components/README.md) for requirements, setup, supported components, and rollback guidance.

For a framework-neutral surface, import the token package directly:

```css
@import 'sandbox-fds-tokens/tokens.css';
```

## Connect the FDS MCP

Use the shared read-only endpoint in an MCP client that supports Streamable HTTP:

```json
{
  "mcpServers": {
    "fr8labs-fds": {
      "url": "https://fr8labs-fds-mcp.vercel.app/api/mcp"
    }
  }
}
```

Restart the MCP client after adding the server. See the [Storybook MCP guide](https://fr8labs-fds-storybook.vercel.app/?path=/docs/getting-started-mcp-pilot--docs) or [repository MCP guide](packages/components/mcp/README.md) for the available tools, local setup, and test prompts.

## Documentation

- [Storybook](https://fr8labs-fds-storybook.vercel.app/) — components, foundations, workflow examples, and release notes.
- [MCP guide](packages/components/mcp/README.md) — hosted and local setup for the approved read-only catalog.
- [IDE and agent MCP integration](docs/fds-mcp-ide-agent-integration.md) — Codex, Claude Code, Cursor, Kiro, VS Code, and generic Streamable HTTP setup.
- [Design principles](docs/principles.md)
- [Component scope](docs/component-scope-v01.md)
- [FDSDataGrid contract](docs/fds-data-grid-contract.md)
- [Freight patterns](docs/freight-patterns-v01.md)
- [Migration guide](docs/migration-guide-v01.md)
- [Approved prototype prompt](prompts/codex-prototype-prompt.md)

Examples and MCP prompts use synthetic freight data only. Do not send customer, shipment, invoice, credential, or production data through the public pilot.

## Repository layout

- `packages/components` — React package, Storybook, catalog, and MCP server.
- `packages/icons` — icon package.
- `packages/tokens` — CSS token package.
- `docs` — public principles, contracts, patterns, and migration guidance.

## Status

The packages remain pre-1.0 releases. Review the [component changelog](packages/components/CHANGELOG.md) before upgrading.

## License

Repository source and package artifacts are licensed under [Apache-2.0](LICENSE).
