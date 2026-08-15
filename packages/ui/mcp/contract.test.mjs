import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {after, before, test} from 'node:test';
import vercelHandler from '../api/mcp.mjs';
import {catalogApi, createHttpServer} from './server.mjs';

const catalogTools = ['get_adoption_recipe', 'get_component', 'get_prompt', 'get_template', 'get_token_reference', 'search_catalog'];
const expectedTools = [...catalogTools, 'get-documentation', 'get-documentation-for-story', 'list-all-documentation'].sort();
const token = 'local-contract-token';
let httpServer;
let endpoint;
let sessionId;

function eventData(text) {
  const data = text.split('\n').find((line) => line.startsWith('data: '));
  return data ? JSON.parse(data.slice(6)) : undefined;
}

async function rpc(method, params = {}, id = 1) {
  const response = await fetch(endpoint, {method: 'POST', headers: {'authorization': `Bearer ${token}`, 'content-type': 'application/json', 'accept': 'application/json, text/event-stream', ...(sessionId ? {'mcp-session-id': sessionId} : {})}, body: JSON.stringify({jsonrpc: '2.0', id, method, params})});
  sessionId ??= response.headers.get('mcp-session-id');
  return {response, message: eventData(await response.text())};
}

before(async () => {
  httpServer = createHttpServer({token});
  await new Promise((resolve) => httpServer.listen(0, '127.0.0.1', resolve));
  endpoint = `http://127.0.0.1:${httpServer.address().port}/mcp`;
});

after(async () => new Promise((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve())));

test('catalog contracts resolve approved records and all 257 tokens', async () => {
  const artifact = JSON.parse(await readFile(new URL('../dist/fds-catalog.json', import.meta.url), 'utf8'));
  assert.equal(artifact.currentApprovedVersion, '0.1.1');
  const tokenItems = artifact.items.filter((item) => item.kind === 'token');
  assert.equal(tokenItems.length, 257);
  for (const item of tokenItems) {
    const result = catalogApi.getTokenReference({tokenPath: item.cssVariable});
    assert.equal(result.error, undefined, `${item.cssVariable} did not resolve`);
    assert.equal(result.tokenPath, item.tokenPath);
  }
  assert.equal(catalogApi.searchCatalog({query: ''}).items.every((item) => item.approvalStatus === 'approved'), true);
  const tokenSearch = catalogApi.searchCatalog({query: 'token', kind: 'token', limit: 50});
  assert.equal(tokenSearch.total, 257);
  assert.equal(tokenSearch.count, 50);
  assert.equal(tokenSearch.hasMore, true);
  const pagedIds = [];
  for (let offset = 0; offset < tokenSearch.total; offset += 50) pagedIds.push(...catalogApi.searchCatalog({query: 'token', kind: 'token', limit: 50, offset}).items.map((item) => item.id));
  assert.equal(new Set(pagedIds).size, 257);
  assert.match(catalogApi.getComponent({id: 'component.button'}).codeSnapshot, /export const Button/);
  assert.match(catalogApi.getTemplate({id: 'template.list-and-review'}).codeSnapshot, /function ListAndReview/);
  assert.match(catalogApi.getPrompt({id: 'prompt.codex-prototype'}).fakeDataRestriction, /Never include production/);
  assert.equal(catalogApi.getTokenReference({tokenPath: 'color.blue.600'}).cssVariable, '--fds-primitive-color-blue-600');
  assert.equal(catalogApi.getTokenReference({tokenPath: 'color.action.primary'}).tokenPath, 'semantic.color.action.primary');
  assert.equal(catalogApi.getTokenReference({tokenPath: '--fds-button-height-medium'}).resolvedValue, '32px');
  assert.equal(catalogApi.getTokenReference({tokenPath: 'compat.font.family.body'}).sourceValue, 'var(--fds-font-family-body)');
  assert.match(catalogApi.getAdoptionRecipe({itemId: 'component.button', mode: 'copy'}).driftWarning, /adopting team owns/);
});

test('version and approval boundaries never return a code snapshot', () => {
  const unavailableVersion = catalogApi.getComponent({id: 'component.button', fdsVersion: '9.9.9'});
  assert.equal(unavailableVersion.error.code, 'FDS_VERSION_UNAVAILABLE');
  assert.deepEqual(unavailableVersion.error.supportedVersions, ['0.1.1']);
  assert.equal('codeSnapshot' in unavailableVersion, false);

  const experimental = catalogApi.getTemplate({id: 'template.sales-invoice-summary'});
  assert.equal(experimental.error.code, 'FDS_ITEM_UNAVAILABLE');
  assert.equal('codeSnapshot' in experimental, false);
  assert.equal(catalogApi.searchCatalog({query: 'sales invoice'}).total, 0);
});

test('Storybook manifests cover every published page and story', async () => {
  const components = JSON.parse(await readFile(new URL('../manifests/components.json', import.meta.url), 'utf8'));
  const docs = JSON.parse(await readFile(new URL('../manifests/docs.json', import.meta.url), 'utf8'));
  const entries = Object.values(components.components);

  assert.equal(entries.length + Object.keys(docs.docs).length, 31);
  assert.equal(entries.reduce((count, entry) => count + (entry.stories?.length ?? 0), 0), 118);
  assert.ok(components.components['components-actions-button']);
  assert.ok(components.components['patterns-operations-list-and-review']);
  assert.ok(components.components['foundations-tokens']);
  assert.ok(docs.docs['getting-started-welcome--docs']);
});

test('Streamable HTTP supports the catalog and complete Storybook documentation', async () => {
  const unauthorized = await fetch(endpoint, {method: 'POST', headers: {'content-type': 'application/json'}, body: '{}'});
  assert.equal(unauthorized.status, 401);

  const pilotServer = createHttpServer();
  await new Promise((resolve) => pilotServer.listen(0, '127.0.0.1', resolve));
  const pilotResponse = await fetch(`http://127.0.0.1:${pilotServer.address().port}/mcp`, {method: 'POST', headers: {'content-type': 'application/json', 'accept': 'application/json, text/event-stream'}, body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'initialize', params: {protocolVersion: '2025-03-26', capabilities: {}, clientInfo: {name: 'fds-pilot-test', version: '1.0.0'}}})});
  assert.equal(pilotResponse.status, 200);
  await new Promise((resolve, reject) => pilotServer.close((error) => error ? reject(error) : resolve()));

  const initialized = await rpc('initialize', {protocolVersion: '2025-03-26', capabilities: {}, clientInfo: {name: 'fds-contract-test', version: '1.0.0'}});
  assert.equal(initialized.response.status, 200);
  assert.equal(initialized.message.result.serverInfo.name, 'fr8labs-fds-mcp-server');

  const listed = await rpc('tools/list');
  assert.deepEqual(listed.message.result.tools.map((tool) => tool.name).sort(), expectedTools);
  for (const tool of listed.message.result.tools.filter((tool) => catalogTools.includes(tool.name))) assert.deepEqual(tool.annotations, {readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false});

  const toolCalls = [
    ['search_catalog', {query: 'token', kind: 'token', limit: 5}],
    ['get_component', {id: 'component.button'}],
    ['get_template', {id: 'template.list-and-review'}],
    ['get_prompt', {id: 'prompt.codex-prototype'}],
    ['get_token_reference', {tokenPath: '--fds-color-action-primary'}],
    ['get_adoption_recipe', {itemId: 'component.button'}],
    ['list-all-documentation', {withStoryIds: true}],
    ['get-documentation', {id: 'components-actions-button'}],
    ['get-documentation-for-story', {componentId: 'components-actions-button', storyName: 'Playground'}],
  ];
  const results = new Map();

  for (const [index, [name, arguments_]] of toolCalls.entries()) {
    const result = await rpc('tools/call', {name, arguments: arguments_}, index + 10);
    assert.equal(result.message.result.isError, undefined, `${name} returned an MCP error`);
    results.set(name, result.message.result);
  }

  assert.equal(results.get('search_catalog').structuredContent.total, 257);
  assert.equal(results.get('get_component').structuredContent.approvalStatus, 'approved');
  assert.match(results.get('get_template').structuredContent.codeSnapshot, /function ListAndReview/);
  assert.match(results.get('get_prompt').structuredContent.fakeDataRestriction, /Never include production/);
  assert.equal(results.get('get_token_reference').structuredContent.resolvedValue, '#0067e7');
  assert.match(results.get('get_adoption_recipe').structuredContent.install, /@fr8labs\/ui@0\.1\.1/);
  assert.match(results.get('list-all-documentation').content[0].text, /foundations-tokens--primitives/);
  assert.match(results.get('get-documentation').content[0].text, /tone/);
  assert.match(results.get('get-documentation-for-story').content[0].text, /Button - Playground/);
});

test('Vercel handler serves the same MCP over /api/mcp', async () => {
  const response = await vercelHandler.fetch(new Request('https://example.vercel.app/api/mcp', {method: 'POST', headers: {'content-type': 'application/json', 'accept': 'application/json, text/event-stream'}, body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'initialize', params: {protocolVersion: '2025-03-26', capabilities: {}, clientInfo: {name: 'fds-vercel-test', version: '1.0.0'}}})}));
  assert.equal(response.status, 200);
  assert.equal(eventData(await response.text()).result.serverInfo.name, 'fr8labs-fds-mcp-server');
});
