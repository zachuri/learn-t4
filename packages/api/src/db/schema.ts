import { InferSelectModel, InferInsertModel, relations, sql } from 'drizzle-orm'
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot'
import { HASH_METHODS } from '../utils/password/hash-methods'

// User
export const UserTable = sqliteTable('User', {
  id: text('id').notNull().primaryKey(),
  email: text('email').notNull(),
})
export const userRelations = relations(UserTable, ({ many }) => ({
  sessions: many(SessionTable),
  authMethods: many(AuthMethodTable),
}))
export type User = InferSelectModel<typeof UserTable>
export type InsertUser = InferInsertModel<typeof UserTable>
export const insertUserSchema = createInsertSchema(UserTable)
export const selectUserSchema = createSelectSchema(UserTable)

// User Key is an authentication method
// Users have a 1-to-many relationship to keys
// The id consists of a provider type combined with a provider id
// https://lucia-auth.com/basics/keys/
export const AuthMethodTable = sqliteTable(
  'AuthMethod',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => UserTable.id),
    hashedPassword: text('hashed_password'),
    hashMethod: text('hash_method', { enum: HASH_METHODS }),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    // The following could be used for password resets, one-time passwords or 2FA
    totpSecret: text('totp_secret'),
    totpExpires: integer('totp_expires', { mode: 'timestamp' }),
    // This is used to prevent brute force attacks and rate limit invalid login attempts
    timeoutUntil: integer('timeout_until', { mode: 'timestamp' }),
    timeoutSeconds: integer('timeout_seconds'),
    // Depending on which providers you connect... you may want to store more data, i.e. username, profile pic, etc
    // Instead of creating separate fields for each, you could add a single field to store any additional data
    // data: text('data', { mode: 'json' })
  },
  (t) => ({
    userIdIdx: index('idx_userKey_userId').on(t.userId),
  })
)
export const userKeyRelations = relations(AuthMethodTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [AuthMethodTable.userId],
    references: [UserTable.id],
  }),
}))
export type AuthMethod = InferSelectModel<typeof AuthMethodTable>
export type InsertAuthMethod = InferInsertModel<typeof AuthMethodTable>
export const AuthMethodSchema = createInsertSchema(AuthMethodTable)

export const SessionTable = sqliteTable(
  'Session',
  {
    id: text('id').notNull().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => UserTable.id),
    // DrizzleSQLiteAdapter currently expects this to be an integer and not use { mode: 'timestamp' }
    expiresAt: integer('expires_at').notNull(),
  },
  (t) => ({
    userIdIdx: index('idx_session_userId').on(t.userId),
  })
)
export const sessionRelations = relations(SessionTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SessionTable.userId],
    references: [UserTable.id],
  }),
}))
export type Session = InferSelectModel<typeof SessionTable>
export type InsertSession = InferInsertModel<typeof SessionTable>
export const SessionSchema = createInsertSchema(SessionTable)

// Car
export const CarTable = sqliteTable('Car', {
  id: text('id').primaryKey(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  color: text('color').notNull(),
  price: real('price').notNull(),
  mileage: integer('mileage').notNull(),
  fuelType: text('fuelType').notNull(),
  transmission: text('transmission').notNull(),
})
export type Car = InferSelectModel<typeof CarTable>
export type InsertCar = InferInsertModel<typeof CarTable>
export const insertCarSchema = createInsertSchema(CarTable)
export const selectCarSchema = createSelectSchema(CarTable)
