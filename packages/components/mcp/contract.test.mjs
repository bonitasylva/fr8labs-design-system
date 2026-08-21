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

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });
}

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
  await listen(httpServer);
  endpoint = `http://127.0.0.1:${httpServer.address().port}/mcp`;
});

after(async () => {
  httpServer.closeAllConnections();
  await new Promise((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve()));
});

test('catalog contracts resolve approved immutable records and all 284 tokens', async () => {
  const artifact = JSON.parse(await readFile(new URL('../dist/fds-catalog.json', import.meta.url), 'utf8'));
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const changelog = await readFile(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
  assert.equal(artifact.currentApprovedVersion, '0.4.0');
  assert.equal(artifact.currentApprovedVersion, packageJson.version);
  assert.equal(changelog.includes(`## [${packageJson.version}] - `), true);
  const tokenItems = artifact.items.filter((item) => item.kind === 'token');
  assert.equal(tokenItems.length, 284);
  for (const item of tokenItems) assert.equal(catalogApi.getTokenReference({tokenPath: item.cssVariable}).tokenPath, item.tokenPath);
  assert.equal(catalogApi.searchCatalog({query: ''}).items.every((item) => item.approvalStatus === 'approved'), true);
  assert.equal(catalogApi.searchCatalog({query: 'token', kind: 'token', limit: 50}).total, 284);
  assert.equal(catalogApi.searchCatalog({query: '', kind: 'component'}).total, 29);
  assert.equal(catalogApi.searchCatalog({query: '', kind: 'template'}).total, 3);
  assert.match(catalogApi.getComponent({id: 'component.button'}).codeSnapshot, /export const Button/);
  assert.match(catalogApi.getComponent({id: 'component.date-time-picker'}).codeSnapshot, /export function DateTimePicker/);
  assert.match(catalogApi.getComponent({id: 'component.fds-data-grid'}).codeSnapshot, /export function FDSDataGrid/);
  assert.match(catalogApi.getComponent({id: 'component.tabs'}).codeSnapshot, /export function Tabs/);
  assert.match(catalogApi.getTemplate({id: 'template.list-and-review'}).codeSnapshot, /function ListAndReview/);
  assert.match(catalogApi.getTemplate({id: 'template.create-and-edit'}).codeSnapshot, /function CreateEditForm/);
  assert.match(catalogApi.getTemplate({id: 'template.record-detail-and-review'}).codeSnapshot, /function RecordDetailReview/);
  assert.match(catalogApi.getPrompt({id: 'prompt.codex-prototype'}).fakeDataRestriction, /Never include production/);
  assert.equal(catalogApi.getTokenReference({tokenPath: 'color.blue.600'}).cssVariable, '--fds-primitive-color-blue-600');
  assert.equal(catalogApi.getTokenReference({tokenPath: 'color.action.primary'}).tokenPath, 'semantic.color.action.primary');
  assert.equal(catalogApi.getTokenReference({tokenPath: '--fds-button-height-medium'}).resolvedValue, '32px');
  assert.equal(catalogApi.getTokenReference({tokenPath: 'semantic.color.action.primary'}).sourceValue, 'var(--fds-primitive-color-blue-600)');
  assert.equal(catalogApi.getTokenReference({tokenPath: 'semantic.color.action.primary'}).theme.overrideAllowed, true);
  assert.equal(catalogApi.getTokenReference({tokenPath: 'semantic.color.text.default'}).theme.overrideAllowed, false);
  assert.equal(catalogApi.getAdoptionRecipe({itemId: 'component.button', mode: 'package'}).install, 'npm install sandbox-fds-components sandbox-fds-icons sandbox-fds-tokens');
  assert.match(catalogApi.getAdoptionRecipe({itemId: 'component.button', mode: 'copy'}).driftWarning, /adopting team owns/);
});

test('version and approval boundaries never return a code snapshot', () => {
  const unavailableVersion = catalogApi.getComponent({id: 'component.button', fdsVersion: '9.9.9'});
  assert.equal(unavailableVersion.error.code, 'FDS_VERSION_UNAVAILABLE');
  assert.deepEqual(unavailableVersion.error.supportedVersions, ['0.4.0']);
  assert.equal('codeSnapshot' in unavailableVersion, false);

  const experimental = catalogApi.getTemplate({id: 'template.sales-invoice-summary'});
  assert.equal(experimental.error.code, 'FDS_ITEM_UNAVAILABLE');
  assert.equal('codeSnapshot' in experimental, false);
  assert.equal(catalogApi.searchCatalog({query: 'sales invoice'}).total, 0);
});

test('MCP pilot documentation lists every registered tool', async () => {
  const pilotDocumentation = await readFile(new URL('../src/stories/McpPilot.mdx', import.meta.url), 'utf8');
  for (const tool of expectedTools) assert.equal(pilotDocumentation.includes(`<code>${tool}</code>`), true);
});

test('Storybook manifests include components, patterns, foundations, and docs', async () => {
  const components = JSON.parse(await readFile(new URL('../manifests/components.json', import.meta.url), 'utf8'));
  const docs = JSON.parse(await readFile(new URL('../manifests/docs.json', import.meta.url), 'utf8'));
  assert.ok(components.components['components-actions-button']);
  assert.ok(components.components['patterns-operations-list-and-review']);
  assert.ok(components.components['foundations-tokens']);
  assert.ok(docs.docs['getting-started-welcome--docs']);
  assert.equal(Object.keys(components.components).some((id) => id.startsWith('internal-')), false);
  assert.equal(components.components['patterns-finance-sales-invoice-summary'], undefined);
  assert.equal(JSON.stringify({components, docs}).includes('/Users/'), false);
  assert.equal(JSON.stringify({components, docs}).includes('No component found'), false);
});

test('HTTP rejects oversized bodies and JSON-RPC batches before transport parsing', async () => {
  const headers = {'authorization': `Bearer ${token}`, 'content-type': 'application/json', 'accept': 'application/json, text/event-stream'};
  const oversized = await fetch(endpoint, {method: 'POST', headers, body: JSON.stringify({value: 'x'.repeat(1024 * 1024)})});
  assert.equal(oversized.status, 413);
  const batch = await fetch(endpoint, {method: 'POST', headers, body: JSON.stringify(Array.from({length: 21}, (_, id) => ({jsonrpc: '2.0', id, method: 'ping'})))});
  assert.equal(batch.status, 413);
});

test('Streamable HTTP supports the same nine read-only tools locally and when hosted', async () => {
  const unauthorized = await fetch(endpoint, {method: 'POST', headers: {'content-type': 'application/json'}, body: '{}'});
  assert.equal(unauthorized.status, 401);

  const pilotServer = createHttpServer();
  await listen(pilotServer);
  const pilotResponse = await fetch(`http://127.0.0.1:${pilotServer.address().port}/mcp`, {method: 'POST', headers: {'content-type': 'application/json', 'accept': 'application/json, text/event-stream'}, body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'initialize', params: {protocolVersion: '2025-03-26', capabilities: {}, clientInfo: {name: 'fds-pilot-test', version: '1.0.0'}}})});
  assert.equal(pilotResponse.status, 200);
  await pilotResponse.arrayBuffer();
  pilotServer.closeAllConnections();
  await new Promise((resolve, reject) => pilotServer.close((error) => error ? reject(error) : resolve()));

  const initialized = await rpc('initialize', {protocolVersion: '2025-03-26', capabilities: {}, clientInfo: {name: 'fds-contract-test', version: '1.0.0'}});
  assert.equal(initialized.response.status, 200);
  assert.equal(initialized.message.result.serverInfo.name, 'fr8labs-fds-mcp-server');

  const listed = await rpc('tools/list');
  assert.deepEqual(listed.message.result.tools.map((tool) => tool.name).sort(), expectedTools);
  for (const tool of listed.message.result.tools.filter((tool) => catalogTools.includes(tool.name))) assert.deepEqual(tool.annotations, {readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false});

  const called = await rpc('tools/call', {name: 'get_component', arguments: {id: 'component.button'}});
  assert.equal(called.message.result.structuredContent.approvalStatus, 'approved');
  assert.equal(called.message.result.structuredContent.resolvedFdsVersion, '0.4.0');

  const documentation = await rpc('tools/call', {name: 'get-documentation', arguments: {id: 'components-actions-button'}}, 3);
  assert.match(documentation.message.result.content[0].text, /Button/);
});

test('Vercel handler serves the same MCP over /api/mcp', async () => {
  const response = await vercelHandler.fetch(new Request('https://example.vercel.app/api/mcp', {method: 'POST', headers: {'content-type': 'application/json', 'accept': 'application/json, text/event-stream'}, body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'initialize', params: {protocolVersion: '2025-03-26', capabilities: {}, clientInfo: {name: 'fds-vercel-test', version: '1.0.0'}}})}));
  assert.equal(response.status, 200);
  assert.equal(eventData(await response.text()).result.serverInfo.name, 'fr8labs-fds-mcp-server');
});
