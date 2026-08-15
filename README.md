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

## Quick start

Use the shared Streamable HTTP endpoint. No local server or Node.js installation is required.

```text
https://fr8labs-fds-mcp.vercel.app/api/mcp
```

Add it to your MCP client's configuration:

```json
{
  "mcpServers": {
    "fr8labs-fds": {
      "url": "https://fr8labs-fds-mcp.vercel.app/api/mcp"
    }
  }
}
```

Restart the client after changing its configuration.

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
