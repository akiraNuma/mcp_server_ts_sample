import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { config } from '../config/index.js'

// Tools
import { sampleTools } from './tools/sample.js'

// Resources
import { sampleResources } from './resources/sample.js'

// Prompts
import { samplePrompts } from './prompts/sample.js'

export function createMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: config.mcp.server.name,
      version: config.mcp.server.version,
    },
    {
      capabilities: config.mcp.capabilities,
    }
  )

  // ツールの登録
  const tools = [...sampleTools]

  for (const t of tools) {
    server.registerTool(t.name, t.config, t.handler)
  }

  // リソースの登録
  const resources = [...sampleResources]

  for (const r of resources) {
    server.registerResource(r.name, r.uri, r.config, r.handler)
  }

  // プロンプトの登録
  const prompts = [...samplePrompts]

  for (const p of prompts) {
    server.registerPrompt(p.name, p.config, p.handler)
  }

  return server
}
