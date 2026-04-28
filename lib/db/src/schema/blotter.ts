import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const blotterReportsTable = pgTable("blotter_reports", {
  id: serial("id").primaryKey(),
  referenceNo: text("reference_no").notNull(),
  reporter: text("reporter").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  dateReported: text("date_reported").notNull(),
  status: text("status").notNull().default("pending"),
  description: text("description").notNull(),
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BlotterReport = typeof blotterReportsTable.$inferSelect;
export type InsertBlotterReport = typeof blotterReportsTable.$inferInsert;
