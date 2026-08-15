# Fr8Labs FDS MCP

> The approved Fr8Labs Design System catalog as a read-only API for AI assistants.

## What is this?

Fr8Labs FDS MCP helps an AI assistant find and use approved FDS components, templates, prompts, tokens, and adoption guidance without inventing APIs or reading the whole repository.

It reads the same versioned catalog represented in Storybook. The pilot exposes approved content only and never modifies FDS or product data.

## Available tools

| Tool | Use it to |
| --- | --- |
| `search_catalog` | Find approved catalog items. |
| `get_component` | Read a component API, code snapshot, states, and accessibility guidance. |
| `get_template` | Read an approved fake-data workflow template. |
| `get_prompt` | Read a bounded FDS authoring prompt. |
| `get_token_reference` | Look up an approved token and CSS variable. |
| `get_adoption_recipe` | Get package or source-copy adoption instructions. |

All tools are read-only. They do not publish, write files, call product APIs, access customer data, or invoke AI sampling.

## Install in your AI coding agent

The shared endpoint uses Streamable HTTP. No repository clone, local server, or Node.js installation is required.

```text
https://fr8labs-fds-mcp.vercel.app/api/mcp
```

### Kiro

Use the [one-click Kiro installer](https://kiro.dev/launch/mcp/add?name=fr8labs-fds&config=%7B%22url%22%3A%22https%3A%2F%2Ffr8labs-fds-mcp.vercel.app%2Fapi%2Fmcp%22%2C%22disabled%22%3Afalse%7D), or add the JSON below to `.kiro/settings/mcp.json` for one workspace or `~/.kiro/settings/mcp.json` for all workspaces.

### Cursor

Add the JSON below to `.cursor/mcp.json` for one project or `~/.cursor/mcp.json` for all projects. Then open **Cursor Settings → Tools & MCP** and enable `fr8labs-fds` if prompted.

```json
{
  "mcpServers": {
    "fr8labs-fds": {
      "url": "https://fr8labs-fds-mcp.vercel.app/api/mcp"
    }
  }
}
```

### Claude Code

```sh
claude mcp add --transport http --scope user fr8labs-fds https://fr8labs-fds-mcp.vercel.app/api/mcp
claude mcp list
```

### Codex

This config is shared by the Codex CLI, IDE extension, and ChatGPT desktop app on the same Codex host.

```sh
codex mcp add fr8labs-fds --url https://fr8labs-fds-mcp.vercel.app/api/mcp
codex mcp list
```

### Other MCP clients

Add a remote server named `fr8labs-fds`, select **Streamable HTTP**, and use the endpoint above. No authentication headers are currently required. See your client's documentation if its configuration format differs from `mcpServers` JSON.

After installation, confirm that the client shows six read-only tools. Official client guides: [Kiro](https://kiro.dev/docs/mcp/configuration/), [Cursor](https://docs.cursor.com/context/model-context-protocol), [Claude Code](https://code.claude.com/docs/en/mcp), and [Codex](https://developers.openai.com/codex/mcp/).

## Run locally

Requirements: Node.js.

From this repository:

```sh
cd packages/ui
npm install
npm run mcp
```

The local endpoint is:

```text
http://127.0.0.1:8787/mcp
```

## Try it

Ask your AI assistant:

```text
Search the FDS catalog for approved action components.
```

```text
Show me the approved Button API and accessibility constraints.
```

```text
Get the List and review template and its fake-data schema.
```

## Pilot status

- Current catalog version: `0.1.1`
- Shared Engineering pilot hosted on Vercel
- Approved catalog results only
- Public and unauthenticated; do not add confidential or customer data
- RootApp validation and final FDS release promotion remain pending

Run the MCP contract checks with:

```sh
npm run test:mcp
```
