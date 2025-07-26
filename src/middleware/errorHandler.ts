import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error handling MCP request:', error)

  if (res.headersSent) {
    return next(error)
  }

  const sessionId = req.headers['mcp-session-id'] as string | undefined
  console.error(`Error for session ${sessionId}:`, error.message)

  res.status(500).json({
    jsonrpc: '2.0',
    error: {
      code: -32603,
      message: 'Internal server error',
      data: process.env.NODE_ENV === 'development' ? error.message : undefined,
    },
    id: null,
  })
}
