import express from 'express'
import { config } from './config/index.js'
import { corsMiddleware } from './middleware/cors.js'
import { loggingMiddleware } from './middleware/logging.js'
import { errorHandler } from './middleware/errorHandler.js'
import { routes } from './routes/index.js'

// Create Express application
export function createApp(): express.Application {
  const app = express()

  // Basic middleware
  app.use(express.json())
  app.use(corsMiddleware)

  // Custom middleware
  if (config.isDevelopment) {
    app.use(loggingMiddleware)
  }

  // Routes
  app.use(routes)

  // Error handling middleware (must be last)
  app.use(errorHandler)

  return app
}

export function startServer() {
  const app = createApp()
  const port = config.server.port

  const server = app.listen(port, (error?: Error) => {
    if (error) {
      console.error('Failed to start server:', error)
      process.exit(1)
    }
    console.log(`MCP Streamable HTTP Server listening on port ${port}`)
    console.log(`MCP endpoint available at: http://localhost:${port}/mcp`)
  })

  // Graceful shutdown handling
  const gracefulShutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`)

    server.close(err => {
      if (err) {
        console.error('Error during server shutdown:', err)
        process.exit(1)
      }

      console.log('Server closed successfully')
      process.exit(0)
    })

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error(
        'Could not close connections in time, forcefully shutting down'
      )
      process.exit(1)
    }, 10000)
  }

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  return server
}
