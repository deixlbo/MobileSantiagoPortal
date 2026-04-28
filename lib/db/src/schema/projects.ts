import { pgTable, serial, text, integer, timestamp, numeric, json } from "drizzle-orm/pg-core";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  code: text("code"),
  category: text("category").notNull(),
  description: text("description").notNull(),
  objectives: json("objectives"),
  budget: numeric("budget", { precision: 14, scale: 2 }).notNull(),
  budgetBreakdown: json("budget_breakdown"),
  startDate: text("start_date").notNull(),
  targetDate: text("target_date").notNull(),
  location: text("location"),
  projectLeader: text("project_leader").notNull(),
  status: text("status").notNull().default("planning"),
  progress: integer("progress").notNull().default(0),
  image: text("image"),
  galleryImages: json("gallery_images"),
  beneficiaries: json("beneficiaries"),
  timeline: json("timeline"),
  sourceOfFunds: text("source_of_funds"),
  engineer: text("engineer"),
  chairman: text("chairman"),
  captain: text("captain"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Project = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;

export interface ProjectTimeline {
  date: string;
  milestone: string;
  description?: string;
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
}

export interface Beneficiary {
  name: string;
  quantity?: number;
  description?: string;
}
