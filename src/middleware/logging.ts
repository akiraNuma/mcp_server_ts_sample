import { Request, Response, NextFunction } from 'express'

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined
  const timestamp = new Date().toISOString()

  console.log(`=== Received MCP request for session: ${sessionId} ===`)
  console.log(
    `[${timestamp}] ${req.method} ${req.path} - Session: ${sessionId || 'none'}`
  )

  if (req.method === 'POST' && req.body) {
    console.log('Request body:', JSON.stringify(req.body, null, 2))
  }

  // レスポンスログ出力のためのインターセプト
  const originalEnd = res.end
  const chunks: Buffer[] = []

  res.end = function (chunk?: any, encoding?: any, callback?: any) {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }

    // レスポンスボディをログ出力
    if (chunks.length > 0) {
      const body = Buffer.concat(chunks).toString('utf8')
      console.log(`[${timestamp}] Response for session ${sessionId}:`)

      // SSE形式のレスポンスかチェック
      if (body.startsWith('event:') || body.includes('data:')) {
        console.log('SSE Response:')
        const lines = body.split('\n')
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const jsonData = line.substring(5).trim()
            try {
              const parsedData = JSON.parse(jsonData)
              console.log('Data:', JSON.stringify(parsedData, null, 2))
            } catch (e) {
              console.log('JSON parse error:', e)
              console.log('Data (raw):', jsonData)
            }
          } else if (line.startsWith('event:')) {
            console.log('Event:', line.substring(6).trim())
          } else if (line.trim()) {
            console.log('Other:', line)
          }
        }
      } else {
        // 通常のJSONレスポンス
        try {
          const responseData = JSON.parse(body)
          console.log(JSON.stringify(responseData, null, 2))
        } catch (e) {
          console.log('(Raw response - not JSON):')
          console.log(body)
        }
      }
      console.log(`=== End Response for session: ${sessionId} ===\n`)
    }

    return originalEnd.call(this, chunk, encoding, callback)
  }

  next()
}
