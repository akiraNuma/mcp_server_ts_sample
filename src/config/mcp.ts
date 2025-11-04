export const mcpConfig = {
  server: {
    name: process.env.MCP_SERVER_NAME || 'mcp-express-server',
    version: process.env.MCP_SERVER_VERSION || '1.0.0',
  },
  capabilities: {
    logging: {},
    tools: {},
    resources: {},
    prompts: {},
  },
  transport: {
    enableJsonResponse: false,
  },
} as const
