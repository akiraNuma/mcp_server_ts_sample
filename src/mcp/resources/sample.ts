import { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js'
import { ResourceDefinition } from '../types.js'

export const sampleResources: ResourceDefinition[] = [
  {
    name: 'status-resource',
    uri: 'https://example.com/status',
    config: {
      title: 'Server Status',
      description: 'Current server status information',
      mimeType: 'application/json',
    },
    handler: async (): Promise<ReadResourceResult> => {
      const status = {
        timestamp: new Date().toISOString(),
        status: 'running',
      }

      return {
        contents: [
          {
            uri: 'https://example.com/status',
            text: JSON.stringify(status, null, 2),
          },
        ],
      }
    },
  },
]
