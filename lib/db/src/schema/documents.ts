import { pgTable, serial, text, timestamp, numeric, boolean } from "drizzle-orm/pg-core";

export const documentRequestsTable = pgTable("document_requests", {
  id: serial("id").primaryKey(),
  referenceNo: text("reference_no").notNull(),
  controlNo: text("control_no"),
  orNumber: text("or_number"),
  residentId: text("resident_id"),
  residentName: text("resident_name").notNull(),
  documentType: text("document_type").notNull(),
  purpose: text("purpose").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method"),
  requestedDate: text("requested_date").notNull(),
  businessName: text("business_name"),
  businessAddress: text("business_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documentCategoriesTable = pgTable("document_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  available: boolean("available").notNull().default(true),
});

export type DocumentRequest = typeof documentRequestsTable.$inferSelect;
export type InsertDocumentRequest = typeof documentRequestsTable.$inferInsert;
export type DocumentCategory = typeof documentCategoriesTable.$inferSelect;
export type InsertDocumentCategory = typeof documentCategoriesTable.$inferInsert;
