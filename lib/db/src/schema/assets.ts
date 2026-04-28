import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const assetsTable = pgTable("assets", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  type: text("type").notNull(),
  sizeKb: integer("size_kb").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  uploadedBy: text("uploaded_by").notNull(),
  uploadedDate: text("uploaded_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Asset = typeof assetsTable.$inferSelect;
export type InsertAsset = typeof assetsTable.$inferInsert;
