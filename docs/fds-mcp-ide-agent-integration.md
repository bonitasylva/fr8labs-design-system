# Connect FDS MCP to an IDE or coding agent

Fr8Labs FDS MCP gives an MCP-compatible IDE or agent read-only access to approved FDS catalog records and published Storybook documentation. Use it before designing or changing UI so the agent can find real components, tokens, accessibility constraints, and adoption guidance.

## Use the hosted server

Use this Streamable HTTP endpoint for normal design and implementation work:

```text
https://fr8labs-fds-mcp.vercel.app/api/mcp
```

The shared pilot is public and read-only. It needs no credentials today. Do not send customer, shipment, invoice, credential, or production data through it.

## Add the server

### Codex app, IDE extension, or CLI

In the Codex app or IDE extension, open **MCP servers** from the settings or gear menu, choose **Add server**, select **Streamable HTTP**, paste the hosted URL, save, then restart the app or extension.

Add FDS globally for the current user, then verify that Codex registered the Streamable HTTP server:

```sh
rtk codex mcp add fr8labs-fds --url https://fr8labs-fds-mcp.vercel.app/api/mcp
rtk codex mcp get fr8labs-fds
```

Restart or open a new Codex task after adding it. Codex's MCP CLI supports remote servers through `--url`; see the [Codex MCP reference](https://developers.openai.com/codex/mcp/).

### Claude Code

Choose `user` for personal cross-project access, or replace it with `project` to create a shareable `.mcp.json` in the current repository:

```sh
rtk claude mcp add --transport http --scope user fr8labs-fds https://fr8labs-fds-mcp.vercel.app/api/mcp
rtk claude mcp get fr8labs-fds
```

In Claude Code, run `/mcp` to check its connection. For a committed project configuration, Claude Code will ask each user to approve the server. See the [Claude Code MCP guide](https://code.claude.com/docs/en/mcp).

### Cursor

Open **Settings → Tools & MCP → New MCP Server**, then add this entry to Cursor's MCP configuration:

```json
{
  "mcpServers": {
    "fr8labs-fds": {
      "url": "https://fr8labs-fds-mcp.vercel.app/api/mcp"
    }
  }
}
```

Save the configuration and restart Cursor or reload its MCP servers. Cursor documents its supported MCP transports and configuration in its [MCP guide](https://docs.cursor.com/context/model-context-protocol).

### Kiro

Open the Command Palette and choose **Kiro: Open user MCP config (JSON)** for personal access, or **Kiro: Open workspace MCP config (JSON)** to create `.kiro/settings/mcp.json` for the current workspace. Add:

```json
{
  "mcpServers": {
    "fr8labs-fds": {
      "url": "https://fr8labs-fds-mcp.vercel.app/api/mcp"
    }
  }
}
```

Save the file; Kiro reconnects the affected server automatically. Confirm it in the Kiro panel's MCP servers list. If it is not available, enable MCP support in Kiro Settings. Leave `autoApprove` unset so Kiro continues to request tool approval. See the [Kiro MCP configuration guide](https://kiro.dev/docs/mcp/configuration/).

### VS Code with GitHub Copilot

Open the Command Palette and run **MCP: Open User Configuration** for a personal configuration, or **MCP: Open Workspace Folder MCP Configuration** for a workspace configuration. Add:

```json
{
  "servers": {
    "fr8labs-fds": {
      "type": "http",
      "url": "https://fr8labs-fds-mcp.vercel.app/api/mcp"
    }
  }
}
```

Start or restart it with **MCP: List Servers**, then enable its tools in the Chat tools picker. See the [VS Code MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration).

### Another MCP-compatible client

Add a remote **HTTP** or **Streamable HTTP** server named `fr8labs-fds` using the hosted URL above. Client schemas vary: use `mcpServers` when the client expects the Claude/Cursor-style schema, or `servers` plus `type: "http"` when it follows the VS Code schema. Do not configure it as stdio or legacy SSE.

## Use a local server while changing FDS source

Run the local server only from this repository when validating unpublished changes:

```sh
npm --prefix packages/components install
npm --prefix packages/components run mcp
```

Point the local IDE or agent at:

```text
http://127.0.0.1:8787/mcp
```

The local server listens only on the same machine. An IDE or agent running in a VM, container, or remote environment usually needs the hosted endpoint instead. Stop the local process when validation is complete.

## Give the agent a useful operating rule

Add this to the agent's project instructions, custom instructions, or opening prompt:

```text
Before creating or changing UI, use Fr8Labs FDS MCP. Search the approved catalog first, then retrieve the relevant component or Storybook documentation and adoption recipe. Use only returned APIs, tokens, and constraints. Do not send customer, shipment, invoice, credential, or production data to the MCP server.
```

For a focused smoke test, ask:

```text
List all FDS Storybook documentation and include story IDs. Then get the approved Button documentation and package adoption recipe. Summarize the real props and accessibility constraints without inventing APIs.
```

## What the server provides

The server exposes nine read-only tools:

- `search_catalog`, `get_component`, `get_template`, and `get_prompt`
- `get_token_reference` and `get_adoption_recipe`
- `list-all-documentation`, `get-documentation`, and `get-documentation-for-story`

It cannot edit application code, install FDS, publish anything, access product APIs, or read customer data. Its output is approved catalog and published Storybook guidance only.

## Troubleshooting

- No tools appear: restart or reload the MCP client, then check that the server type is HTTP/Streamable HTTP and the URL includes `/api/mcp`.
- `401 Unauthorized`: do not add a token to a committed configuration. The shared endpoint is normally unauthenticated; contact the FDS owner because the deployment may have changed.
- `403 browser origins are not allowed`: use an MCP client, not a browser-based fetch or browser extension bridge.
- The local endpoint does not connect: confirm the MCP client runs on the same host as the FDS server and that `npm --prefix packages/components run mcp` is still running.
- Results look old: refresh the client's MCP tool cache or reconnect. The hosted endpoint reflects the published snapshot, while the local endpoint reflects the checked-out source.

For FDS-specific tool details and contract checks, see the [MCP package guide](../packages/components/mcp/README.md).
