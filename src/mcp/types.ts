import { z } from 'zod'
import {
  CallToolResult,
  ReadResourceResult,
  GetPromptResult,
} from '@modelcontextprotocol/sdk/types.js'

// Tool types
export interface ToolDefinition {
  name: string
  config: {
    title: string
    description: string
    inputSchema: Record<string, z.ZodType>
  }
  handler: (args?: Record<string, unknown>) => Promise<CallToolResult>
}

// Resource types
export interface ResourceDefinition {
  name: string
  uri: string
  config: {
    title: string
    description: string
    mimeType: string
  }
  handler: () => Promise<ReadResourceResult>
}

// Prompt types
export interface PromptDefinition {
  name: string
  config: {
    title: string
    description: string
    argsSchema?: Record<string, z.ZodType>
  }
  handler: (args?: Record<string, unknown>) => Promise<GetPromptResult>
}
