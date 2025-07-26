export const serverConfig = {
  port: parseInt(process.env.MCP_PORT || '3000', 10),
  host: process.env.HOST || 'localhost',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
    exposedHeaders: ['Mcp-Session-Id'] as string[],
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
  },
} as const
