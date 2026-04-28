import { pgTable, serial, text, integer, timestamp, numeric, json } from "drizzle-orm/pg-core";

export const assetsTable = pgTable("assets", {
  id: serial("id").primaryKey(),
  assetCode: text("asset_code").notNull().unique(),
  assetName: text("asset_name").notNull(),
  assetType: text("asset_type").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull().default(1),
  unit: text("unit"),
  acquisitionDate: text("acquisition_date"),
  acquisitionCost: numeric("acquisition_cost", { precision: 14, scale: 2 }),
  condition: text("condition"),
  status: text("status").notNull().default("available"),
  location: text("location"),
  assignedTo: text("assigned_to"),
  image: text("image"),
  barcode: text("barcode"),
  brandModel: text("brand_model"),
  serialNumber: text("serial_number"),
  plateNumber: text("plate_number"),
  engineNumber: text("engine_number"),
  chassisNumber: text("chassis_number"),
  fuelType: text("fuel_type"),
  yearModel: text("year_model"),
  color: text("color"),
  crNumber: text("cr_number"),
  orNumber: text("or_number"),
  maintenanceRecords: json("maintenance_records"),
  uploadedBy: text("uploaded_by").notNull(),
  uploadedDate: text("uploaded_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Asset = typeof assetsTable.$inferSelect;
export type InsertAsset = typeof assetsTable.$inferInsert;

export interface MaintenanceRecord {
  date: string;
  type: string;
  description: string;
  cost?: number;
  performedBy?: string;
}

export interface AssetCondition {
  value: string;
  lastUpdated?: string;
}
