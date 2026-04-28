import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const ordinancesTable = pgTable("ordinances", {
  id: serial("id").primaryKey(),
  ordinanceNumber: text("ordinance_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ordinanceType: text("ordinance_type").notNull(),
  author: text("author").notNull(),
  status: text("status").notNull().default("draft"),
  enactedDate: text("enacted_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Ordinance = typeof ordinancesTable.$inferSelect;
export type InsertOrdinance = typeof ordinancesTable.$inferInsert;
