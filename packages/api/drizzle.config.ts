import { config } from 'dotenv'

config({
  path: '.dev.vars',
})

import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: './src/db/schema.ts', //separate the schemas
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
})
