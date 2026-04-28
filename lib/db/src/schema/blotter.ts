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
  respondent: text("respondent"),
  actionTaken: text("action_taken"),
  resolutionNotes: text("resolution_notes"),
  dateResolved: text("date_resolved"),
  preparedBy: text("prepared_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BlotterReport = typeof blotterReportsTable.$inferSelect;
export type InsertBlotterReport = typeof blotterReportsTable.$inferInsert;
