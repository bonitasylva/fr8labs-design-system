import {respondToMcpRequest} from '../mcp/server.mjs';

export default {
  fetch(request) {
    return respondToMcpRequest(request, {token: process.env.FDS_MCP_TOKEN, path: '/api/mcp'});
  },
};
