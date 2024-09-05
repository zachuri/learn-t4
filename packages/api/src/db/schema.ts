import { InferInsertModel, InferSelectModel, relations, sql } from 'drizzle-orm'
import { doublePrecision, index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot'
import { HASH_METHODS } from '../utils/password/hash-methods'

// User
export const UserTable = pgTable('user', {
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
export const AuthMethodTable = pgTable(
  'authMethod',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => UserTable.id),
    hashedPassword: text('hashed_password'),
    hashMethod: text('hash_method', { enum: HASH_METHODS }),
    createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    // The following could be used for password resets, one-time passwords or 2FA
    totpSecret: text('totp_secret'),
    totpExpires: timestamp('totp_expires'),
    // This is used to prevent brute force attacks and rate limit invalid login attempts
    timeoutUntil: timestamp('timeout_until'),
    timeoutSeconds: integer('timeout_seconds'),
    // Depending on which providers you connect... you may want to store more data, i.e. username, profile pic, etc
    // Instead of creating separate fields for each, you could add a single field to store any additional data
    // data: jsonb('data')
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

export const SessionTable = pgTable(
  'session',
  {
    id: text('id').notNull().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => UserTable.id),
    expiresAt: timestamp('expires_at').notNull(),
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
export const CarTable = pgTable('car', {
  id: text('id').primaryKey(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  color: text('color').notNull(),
  price: doublePrecision('price').notNull(),
  mileage: integer('mileage').notNull(),
  fuelType: text('fuel_type').notNull(),
  transmission: text('transmission').notNull(),
})
export type Car = InferSelectModel<typeof CarTable>
export type InsertCar = InferInsertModel<typeof CarTable>
export const insertCarSchema = createInsertSchema(CarTable)
export const selectCarSchema = createSelectSchema(CarTable)
