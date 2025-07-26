import cors from 'cors'
import { config } from '../config/index.js'

export const corsMiddleware = cors({
  origin: config.server.cors.origin,
  credentials: config.server.cors.credentials,
  exposedHeaders: config.server.cors.exposedHeaders,
})
