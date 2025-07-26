import { z } from 'zod'
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { ToolDefinition } from '../types'

export const sampleTools: ToolDefinition[] = [
  {
    name: 'greet',
    config: {
      title: 'Greeting Tool',
      description: 'A simple greeting tool',
      inputSchema: {
        name: z.string().describe('Name to greet'),
      },
    },
    handler: async (args: { name?: string } = {}): Promise<CallToolResult> => {
      const { name } = args
      return {
        content: [
          {
            type: 'text',
            text: `Hello, ${name}!`,
          },
        ],
      }
    },
  },
  {
    name: 'echo',
    config: {
      title: 'Echo Tool',
      description: 'Echoes back the input message',
      inputSchema: {
        message: z.string().describe('Message to echo'),
      },
    },
    handler: async (
      args: { message?: string } = {}
    ): Promise<CallToolResult> => {
      const { message } = args
      return {
        content: [
          {
            type: 'text',
            text: `Echo: ${message}`,
          },
        ],
      }
    },
  },
]
