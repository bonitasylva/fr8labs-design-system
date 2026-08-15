import {timingSafeEqual} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createServer as createNodeServer} from 'node:http';
import {dirname, resolve} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {ValibotJsonSchemaAdapter} from '@tmcp/adapter-valibot';
import {HttpTransport} from '@tmcp/transport-http';
import {McpServer} from 'tmcp';
import * as v from 'valibot';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(resolve(packageRoot, 'dist/fds-catalog.json'), 'utf8'));
const supportedVersions = [...new Set(catalog.items.filter((item) => item.status === 'approved').map((item) => item.fdsVersion))].sort();
const annotations = {readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false};
const versionField = v.optional(v.pipe(v.string(), v.maxLength(30)));
const idField = v.pipe(v.string(), v.minLength(1), v.maxLength(160));

const versionError = (requestedFdsVersion) => ({
  error: {code: 'FDS_VERSION_UNAVAILABLE', message: `FDS version ${requestedFdsVersion} is not retained.`, supportedVersions},
  requestedFdsVersion,
  resolvedFdsVersion: null,
});

const unavailableError = (id, requestedFdsVersion, resolvedFdsVersion) => ({
  error: {code: 'FDS_ITEM_UNAVAILABLE', message: `No approved catalog item is available for ${id}.`},
  requestedFdsVersion: requestedFdsVersion ?? null,
  resolvedFdsVersion,
});

function resolveVersion(requestedFdsVersion) {
  const resolvedFdsVersion = requestedFdsVersion ?? catalog.currentApprovedVersion;
  return supportedVersions.includes(resolvedFdsVersion) ? {requestedFdsVersion: requestedFdsVersion ?? null, resolvedFdsVersion} : versionError(resolvedFdsVersion);
}

function approvedItem(id, kind, requestedFdsVersion) {
  const version = resolveVersion(requestedFdsVersion);
  if (version.error) return version;
  const item = catalog.items.find((candidate) => candidate.id === id && candidate.kind === kind && candidate.status === 'approved' && candidate.fdsVersion === version.resolvedFdsVersion);
  return item ? {item, ...version} : unavailableError(id, requestedFdsVersion, version.resolvedFdsVersion);
}

export const catalogApi = {
  searchCatalog({query, kind, fdsVersion, limit = 20, offset = 0}) {
    const version = resolveVersion(fdsVersion);
    if (version.error) return version;
    const needle = query.trim().toLowerCase();
    const matches = catalog.items.filter((item) => item.status === 'approved' && item.fdsVersion === version.resolvedFdsVersion && (!kind || item.kind === kind) && [item.id, item.title, item.summary].some((value) => value.toLowerCase().includes(needle)));
    const items = matches.slice(offset, offset + limit).map(({id, kind: itemKind, status, fdsVersion: itemVersion, title, summary, source}) => ({id, kind: itemKind, approvalStatus: status, fdsVersion: itemVersion, title, summary, storybook: source.storybookTitle ? {title: source.storybookTitle, storyId: source.storybookId} : undefined}));
    return {...version, approvalStatus: 'approved', total: matches.length, count: items.length, offset, hasMore: offset + items.length < matches.length, nextOffset: offset + items.length < matches.length ? offset + items.length : null, items};
  },
  getComponent({id, fdsVersion}) {
    const result = approvedItem(id, 'component', fdsVersion);
    if (result.error) return result;
    const {item, ...version} = result;
    return {...version, id: item.id, approvalStatus: item.status, fdsVersion: item.fdsVersion, title: item.title, summary: item.summary, api: item.api, codeSnapshot: item.codeSnapshot, dependencies: item.dependencies, states: item.states, accessibility: item.accessibility, source: item.source};
  },
  getTemplate({id, fdsVersion}) {
    const result = approvedItem(id, 'template', fdsVersion);
    if (result.error) return result;
    const {item, ...version} = result;
    return {...version, id: item.id, approvalStatus: item.status, fdsVersion: item.fdsVersion, title: item.title, summary: item.summary, slots: item.slots, allowedComponentIds: item.allowedComponentIds, fakeFixtureSchema: item.fakeFixtureSchema, codeSnapshot: item.codeSnapshot, dependencies: item.dependencies, states: item.states, accessibility: item.accessibility, source: item.source};
  },
  getPrompt({id, fdsVersion}) {
    const result = approvedItem(id, 'prompt', fdsVersion);
    if (result.error) return result;
    const {item, ...version} = result;
    return {...version, id: item.id, approvalStatus: item.status, fdsVersion: item.fdsVersion, title: item.title, summary: item.summary, prompt: item.prompt, inputs: item.inputs, allowedIds: item.allowedIds, fakeDataRestriction: item.fakeDataRestriction, dependencies: item.dependencies, accessibility: item.accessibility, source: item.source};
  },
  getTokenReference({tokenPath, fdsVersion}) {
    const version = resolveVersion(fdsVersion);
    if (version.error) return version;
    const item = catalog.items.find((candidate) => candidate.kind === 'token' && candidate.tokenPath === tokenPath && candidate.status === 'approved' && candidate.fdsVersion === version.resolvedFdsVersion);
    if (!item) return unavailableError(tokenPath, fdsVersion, version.resolvedFdsVersion);
    return {...version, id: item.id, approvalStatus: item.status, fdsVersion: item.fdsVersion, tokenPath: item.tokenPath, dtcgValue: item.dtcgValue, cssVariable: item.cssVariable, aliasUsedBy: item.aliasUsedBy, permittedUsage: item.permittedUsage, dependencies: item.dependencies, accessibility: item.accessibility, source: item.source};
  },
  getAdoptionRecipe({itemId, fdsVersion, mode = 'package'}) {
    const version = resolveVersion(fdsVersion);
    if (version.error) return version;
    const item = catalog.items.find((candidate) => candidate.kind === 'adoption_recipe' && candidate.targetId === itemId && candidate.status === 'approved' && candidate.fdsVersion === version.resolvedFdsVersion);
    if (!item) return unavailableError(itemId, fdsVersion, version.resolvedFdsVersion);
    return {...version, id: item.id, itemId, mode, approvalStatus: item.status, fdsVersion: item.fdsVersion, exactVersion: item.fdsVersion, dependencies: item.dependencies, accessibility: item.accessibility, ...item.modes[mode], source: item.source};
  },
};

function toolResult(result) {
  return {content: [{type: 'text', text: JSON.stringify(result, null, 2)}], structuredContent: result, ...(result.error ? {isError: true} : {})};
}

export function createMcpServer() {
  const server = new McpServer({name: 'fr8labs-fds-mcp-server', version: catalog.currentApprovedVersion, description: 'Authenticated, versioned, read-only Fr8Labs FDS catalog.'}, {adapter: new ValibotJsonSchemaAdapter(), capabilities: {tools: {}}});
  const register = (name, title, description, schema, handler) => server.tool({name, title, description, schema, annotations}, (input) => toolResult(handler(input)));

  register('search_catalog', 'Search FDS catalog', 'Search approved FDS catalog records. Returns approved summaries only and never returns code snapshots.', v.strictObject({query: v.pipe(v.string(), v.minLength(1), v.maxLength(200), v.regex(/\S/, 'Query must contain a non-whitespace character.')), kind: v.optional(v.picklist(['component', 'template', 'prompt', 'token', 'adoption_recipe'])), fdsVersion: versionField, limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(50))), offset: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0)))}), catalogApi.searchCatalog);
  register('get_component', 'Get FDS component', 'Get one approved component API, immutable code snapshot, dependencies, states, and accessibility constraints.', v.strictObject({id: idField, fdsVersion: versionField}), catalogApi.getComponent);
  register('get_template', 'Get FDS template', 'Get one approved fake-data template, allowed composition, immutable code snapshot, and accessibility constraints.', v.strictObject({id: idField, fdsVersion: versionField}), catalogApi.getTemplate);
  register('get_prompt', 'Get FDS prompt', 'Get one approved bounded prompt and its fake-data restriction. Never invokes sampling.', v.strictObject({id: idField, fdsVersion: versionField}), catalogApi.getPrompt);
  register('get_token_reference', 'Get FDS token reference', 'Get one approved DTCG token reference, CSS variable, alias, and permitted usage.', v.strictObject({tokenPath: idField, fdsVersion: versionField}), catalogApi.getTokenReference);
  register('get_adoption_recipe', 'Get FDS adoption recipe', 'Get approved package or owned-copy adoption instructions with exact version and drift warning.', v.strictObject({itemId: idField, fdsVersion: versionField, mode: v.optional(v.picklist(['package', 'copy']))}), catalogApi.getAdoptionRecipe);
  return server;
}

function authorized(header, token) {
  const supplied = header?.startsWith('Bearer ') ? header.slice(7) : '';
  const expected = Buffer.from(token);
  const actual = Buffer.from(supplied);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function respondToMcpRequest(request, {token, path = '/mcp'} = {}) {
  if (new URL(request.url).pathname !== path) return new Response(null, {status: 404});
  if (token && !authorized(request.headers.get('authorization'), token)) {
    return Response.json({error: 'unauthorized'}, {status: 401, headers: {'www-authenticate': 'Bearer realm="Fr8Labs FDS MCP"'}});
  }
  if (request.headers.has('origin')) return Response.json({error: 'browser origins are not allowed'}, {status: 403});
  return await new HttpTransport(createMcpServer(), {path, disableSse: true}).respond(request) ?? new Response(null, {status: 404});
}

export function createHttpServer({token} = {}) {
  return createNodeServer(async (request, response) => {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? '127.0.0.1'}`);
    const body = request.method === 'POST' ? Buffer.concat(await Array.fromAsync(request)) : undefined;
    const mcpResponse = await respondToMcpRequest(new Request(url, {method: request.method, headers: request.headers, body, ...(body ? {duplex: 'half'} : {})}), {token});
    response.writeHead(mcpResponse.status, Object.fromEntries(mcpResponse.headers));
    response.end(Buffer.from(await mcpResponse.arrayBuffer()));
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createHttpServer({token: process.env.FDS_MCP_TOKEN});
  const port = Number(process.env.PORT ?? 8787);
  server.listen(port, '127.0.0.1', () => console.log(`Fr8Labs FDS MCP listening on http://127.0.0.1:${port}/mcp`));
}
