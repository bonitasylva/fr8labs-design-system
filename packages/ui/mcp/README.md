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

Requirements: Node.js and an MCP client that supports Streamable HTTP.

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

## Connect your MCP client

Add the endpoint to your client's MCP configuration. The exact config location depends on the client.

```json
{
  "mcpServers": {
    "fr8labs-fds": {
      "url": "http://127.0.0.1:8787/mcp"
    }
  }
}
```

Restart the client after changing its configuration.

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
- Local engineering pilot only
- Approved catalog results only
- Authentication is deferred until the hosted release
- RootApp validation and final FDS release promotion remain pending

Run the MCP contract checks with:

```sh
npm run test:mcp
```

## Engineering pilot checklist

- Start the local server with `npm run mcp` from `packages/ui`.
- Connect the MCP client to `http://127.0.0.1:8787/mcp`.
- Confirm the client lists exactly the six tools documented above.
- Run one approved lookup, such as `get_component` for `component.button`.
- Confirm version `9.9.9` and experimental item `template.sales-invoice-summary` return unavailable errors without code snapshots.
- Report the client name/version, FDS version, and results.
