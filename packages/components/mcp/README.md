# Fr8Labs FDS MCP

> The approved Fr8Labs Design System catalog as a read-only API for AI assistants.

## What is this?

Fr8Labs FDS MCP helps an AI assistant find and use approved FDS catalog guidance and published Storybook documentation without inventing APIs or reading the whole repository.

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
| `list-all-documentation` | List published Storybook entries and story IDs. |
| `get-documentation` | Read one Storybook entry's API, props, guidance, and examples. |
| `get-documentation-for-story` | Read one published story scenario. |

All tools are read-only. They do not publish, write files, call product APIs, access customer data, or invoke AI sampling.

## Quick start

Requirements: Node.js and an MCP client that supports Streamable HTTP.

From this repository:

```sh
cd packages/components
npm install
npm run mcp
```

The local endpoint is:

```text
http://127.0.0.1:8787/mcp
```

The shared endpoint is:

```text
https://fr8labs-fds-mcp.vercel.app/api/mcp
```

## Connect your MCP client

Add the endpoint to your client's MCP configuration. The exact config location depends on the client.

```json
{
  "mcpServers": {
    "fr8labs-fds": {
      "url": "https://fr8labs-fds-mcp.vercel.app/api/mcp"
    }
  }
}
```

Restart the client after changing its configuration. Use the local URL while validating source changes; both endpoints expose the same nine tools.

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

- Current catalog version: `0.2.0`
- Shared Engineering pilot snapshot hosted on Vercel
- Local source builds current Storybook manifests; the hosted endpoint remains the published snapshot until deployment
- Approved catalog results only
- Public and unauthenticated; do not add confidential or customer data
- RootApp validation and final FDS release promotion remain pending

Run the MCP contract checks with:

```sh
npm run test:mcp
```
