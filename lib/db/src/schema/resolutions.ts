import { pgTable, serial, text, timestamp, json } from "drizzle-orm/pg-core";

export const resolutionsTable = pgTable("resolutions", {
  id: serial("id").primaryKey(),
  resolutionNumber: text("resolution_number").notNull().unique(),
  blotterEntryNo: text("blotter_entry_no"),
  caseStatus: text("case_status").notNull().default("pending"),
  dateClosed: text("date_closed"),
  resolutionType: text("resolution_type").notNull(), // "blotter", "ordinance", "clearance"
  complainerName: text("complainer_name"),
  respondentName: text("respondent_name"),
  caseDetails: text("case_details"),
  dateOfIncident: text("date_of_incident"),
  timeOfIncident: text("time_of_incident"),
  placeOfIncident: text("place_of_incident"),
  natureOfCase: text("nature_of_case"),
  mediationDate: text("mediation_date"),
  agreement: text("agreement"),
  approvedDate: text("approved_date"),
  barangayOfficials: json("barangay_officials"),
  preparedBy: text("prepared_by"),
  checkedBy: text("checked_by"),
  approvedBy: text("approved_by"),
  notedBy: text("noted_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Resolution = typeof resolutionsTable.$inferSelect;
export type InsertResolution = typeof resolutionsTable.$inferInsert;

export interface BarangayOfficial {
  position: string;
  name: string;
  title?: string;
}
