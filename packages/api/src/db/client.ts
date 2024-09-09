import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

export const createDb = (connectionString: string) => {
  const client = neon(connectionString) as NeonQueryFunction<boolean, boolean>
  return drizzle(client, { schema })
}

export type DB = NeonHttpDatabase<typeof schema>
