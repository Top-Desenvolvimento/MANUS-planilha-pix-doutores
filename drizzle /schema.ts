import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, longtext } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clínicas do grupo
 */
export const clinics = mysqlTable("clinics", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  systemUrl: varchar("systemUrl", { length: 500 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Clinic = typeof clinics.$inferSelect;
export type InsertClinic = typeof clinics.$inferInsert;

/**
 * Doutores com controle de créditos
 */
export const doctors = mysqlTable("doctors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  pixKey: varchar("pixKey", { length: 255 }).notNull().unique(),
  clinicId: int("clinicId").notNull(),
  creditAvailable: decimal("creditAvailable", { precision: 12, scale: 2 }).default("0").notNull(),
  creditTotal: decimal("creditTotal", { precision: 12, scale: 2 }).default("0").notNull(),
  isBlocked: boolean("isBlocked").default(false).notNull(),
  blockedAt: timestamp("blockedAt"),
  blockedReason: text("blockedReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = typeof doctors.$inferInsert;

/**
 * Lançamentos de PIX
 */
export const pixTransactions = mysqlTable("pixTransactions", {
  id: int("id").autoincrement().primaryKey(),
  transactionDate: timestamp("transactionDate").notNull(),
  patientName: varchar("patientName", { length: 255 }).notNull(),
  pixOrigin: varchar("pixOrigin", { length: 100 }).notNull(), // "paciente" ou "outra_pessoa"
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  pixKey: varchar("pixKey", { length: 255 }).notNull(),
  doctorId: int("doctorId"),
  clinicId: int("clinicId").notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  googleSheetsRowId: varchar("googleSheetsRowId", { length: 100 }),
  syncedToSheets: boolean("syncedToSheets").default(false).notNull(),
  syncedAt: timestamp("syncedAt"),
  creditDeducted: decimal("creditDeducted", { precision: 12, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["pending", "processed", "synced", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PixTransaction = typeof pixTransactions.$inferSelect;
export type InsertPixTransaction = typeof pixTransactions.$inferInsert;

/**
 * Histórico de movimentação de créditos
 */
export const creditHistory = mysqlTable("creditHistory", {
  id: int("id").autoincrement().primaryKey(),
  doctorId: int("doctorId").notNull(),
  transactionId: int("transactionId"),
  movementType: mysqlEnum("movementType", ["debit", "credit", "adjustment", "block", "unblock"]).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  previousBalance: decimal("previousBalance", { precision: 12, scale: 2 }).notNull(),
  newBalance: decimal("newBalance", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditHistory = typeof creditHistory.$inferSelect;
export type InsertCreditHistory = typeof creditHistory.$inferInsert;

/**
 * Histórico de sincronizações
 */
export const syncHistory = mysqlTable("syncHistory", {
  id: int("id").autoincrement().primaryKey(),
  clinicId: int("clinicId").notNull(),
  syncType: mysqlEnum("syncType", ["manual", "automatic", "google_sheets"]).notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "success", "failed"]).default("pending").notNull(),
  recordsProcessed: int("recordsProcessed").default(0).notNull(),
  recordsFailed: int("recordsFailed").default(0).notNull(),
  errorMessage: text("errorMessage"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type SyncHistory = typeof syncHistory.$inferSelect;
export type InsertSyncHistory = typeof syncHistory.$inferInsert;

/**
 * Configurações de integração Google Sheets
 */
export const googleSheetsConfig = mysqlTable("googleSheetsConfig", {
  id: int("id").autoincrement().primaryKey(),
  spreadsheetId: varchar("spreadsheetId", { length: 255 }).notNull(),
  sheetName: varchar("sheetName", { length: 255 }).notNull(),
  accessToken: longtext("accessToken").notNull(),
  refreshToken: longtext("refreshToken"),
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GoogleSheetsConfig = typeof googleSheetsConfig.$inferSelect;
export type InsertGoogleSheetsConfig = typeof googleSheetsConfig.$inferInsert;
