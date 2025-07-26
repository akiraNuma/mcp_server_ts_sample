import dotenv from 'dotenv'
import { serverConfig } from './server'
import { mcpConfig } from './mcp'

// Load environment variables
dotenv.config()

export const config = {
  server: serverConfig,
  mcp: mcpConfig,
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const

export * from './server'
export * from './mcp'
