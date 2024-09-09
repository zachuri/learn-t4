import { config } from 'dotenv'
import { sql } from 'drizzle-orm'
import { promises as fs } from 'fs'
import { createDb } from './client'

config({
  path: '.dev.vars',
})

const db = createDb(process.env.DATABASE_URL!)

async function main() {
  console.log('Seeding database...')

  try {
    const seedSQL = await fs.readFile('seed/seed.sql', 'utf8')
    await db.execute(sql.raw(seedSQL))
    console.log('Database seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

main()
