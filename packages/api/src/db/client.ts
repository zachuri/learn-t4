// import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1'
// import * as schema from './schema'

// export const createDb = (d1: D1Database) => {
//   return drizzle(d1, {
//     schema,
//     // logger: true,
//   })
// }

// export type DB = DrizzleD1Database<typeof schema>

// import type { Context } from "hono"

import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

export const createDb = (connectionString: string) => {
  const client = neon(connectionString) as NeonQueryFunction<boolean, boolean>
  return drizzle(client, { schema })
}

export type DB = NeonHttpDatabase<typeof schema>
