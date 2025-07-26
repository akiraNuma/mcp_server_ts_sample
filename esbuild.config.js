import { build } from 'esbuild'

const buildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  platform: 'node',
  target: 'node18',
  format: 'esm',
  minify: true,
  external: ['@modelcontextprotocol/sdk', 'express', 'cors', 'dotenv', 'zod'],
}

build(buildOptions).catch(() => process.exit(1))
