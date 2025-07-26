import { Router, Request, Response } from 'express'
import { randomUUID } from 'node:crypto'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import { createMcpServer } from '../mcp/index.js'
import { config } from '../config/index.js'

const router = Router()

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {}

// MCP POST endpoint
router.post('/mcp', async (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined

  try {
    let transport: StreamableHTTPServerTransport

    if (sessionId && transports[sessionId]) {
      // Reuse existing transport
      transport = transports[sessionId]
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        enableJsonResponse: config.mcp.transport.enableJsonResponse,
        onsessioninitialized: sessionId => {
          console.log(`Session initialized with ID: ${sessionId}`)
          transports[sessionId] = transport
        },
      })

      // Set up onclose handler to clean up transport when closed
      transport.onclose = () => {
        const sid = transport.sessionId
        if (sid && transports[sid]) {
          console.log(
            `Transport closed for session ${sid}, removing from transports map`
          )
          delete transports[sid]
        }
      }

      // Connect the transport to the MCP server
      const server = createMcpServer()
      await server.connect(transport)
      await transport.handleRequest(req, res, req.body)
      return
    } else {
      // Invalid request - no session ID or not initialization request
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: null,
      })
      return
    }

    // Handle the request with existing transport
    await transport.handleRequest(req, res, req.body)
  } catch (error) {
    console.error('Error handling MCP request:', error)
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      })
    }
  }
})

// Handle GET requests for SSE streams
router.get('/mcp', async (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined

  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID')
    return
  }

  const lastEventId = req.headers['last-event-id'] as string | undefined
  if (lastEventId) {
    console.log(`Client reconnecting with Last-Event-ID: ${lastEventId}`)
  } else {
    console.log(`Establishing new SSE stream for session ${sessionId}`)
  }

  const transport = transports[sessionId]
  await transport.handleRequest(req, res)
})

// Handle DELETE requests for session termination
router.delete('/mcp', async (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined

  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID')
    return
  }

  console.log(`Received session termination request for session ${sessionId}`)

  try {
    const transport = transports[sessionId]
    await transport.handleRequest(req, res)
  } catch (error) {
    console.error('Error handling session termination:', error)
    if (!res.headersSent) {
      res.status(500).send('Error processing session termination')
    }
  }
})

export { router as mcpRouter }
