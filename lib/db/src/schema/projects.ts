import { pgTable, serial, text, integer, timestamp, numeric } from "drizzle-orm/pg-core";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  budget: numeric("budget", { precision: 14, scale: 2 }).notNull(),
  startDate: text("start_date").notNull(),
  targetDate: text("target_date").notNull(),
  projectLeader: text("project_leader").notNull(),
  status: text("status").notNull().default("planning"),
  progress: integer("progress").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Project = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;
