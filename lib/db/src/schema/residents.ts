import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const residentsTable = pgTable("residents", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  purok: text("purok").notNull(),
  gender: text("gender").notNull(),
  civilStatus: text("civil_status").notNull(),
  birthDate: text("birth_date").notNull(),
  address: text("address").notNull(),
  documentType: text("document_type"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Resident = typeof residentsTable.$inferSelect;
export type InsertResident = typeof residentsTable.$inferInsert;
