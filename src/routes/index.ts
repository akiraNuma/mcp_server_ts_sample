import { Router } from 'express'
import { mcpRouter } from './mcp.js'

const router = Router()

// Register all routes
router.use(mcpRouter)

export { router as routes }
