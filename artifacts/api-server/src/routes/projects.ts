import { Router, type IRouter } from "express";
import { db, projectsTable } from "@workspace/db";
import {
  CreateProjectBody,
  GetProjectParams,
  UpdateProjectBody,
  ListProjectsQueryParams,
} from "@workspace/api-zod";
import { eq, sql, ilike, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/projects", async (req, res) => {
  const params = ListProjectsQueryParams.parse(req.query);
  const conds = [];
  if (params.search) conds.push(ilike(projectsTable.title, `%${params.search}%`));
  if (params.status) conds.push(eq(projectsTable.status, params.status));
  const rows = await db
    .select()
    .from(projectsTable)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(projectsTable.id);
  res.json(
    rows.map((r) => ({
      ...r,
      budget: Number(r.budget),
      createdAt: r.createdAt.toISOString(),
    })),
  );
});

router.get("/projects/stats", async (_req, res) => {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      ongoing: sql<number>`count(*) filter (where status = 'ongoing')::int`,
      planning: sql<number>`count(*) filter (where status = 'planning')::int`,
      completed: sql<number>`count(*) filter (where status = 'completed')::int`,
      totalBudget: sql<number>`coalesce(sum(budget), 0)::float`,
    })
    .from(projectsTable);
  res.json(row);
});

router.get("/projects/:id", async (req, res) => {
  const { id } = GetProjectParams.parse(req.params);
  const [row] = await db.select().from(projectsTable).where(eq(projectsTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({
    ...row,
    budget: Number(row.budget),
    createdAt: row.createdAt.toISOString(),
  });
});

router.post("/projects", async (req, res) => {
  const body = CreateProjectBody.parse(req.body);
  const [row] = await db
    .insert(projectsTable)
    .values({
      ...body,
      budget: String(body.budget),
      status: body.status ?? "planning",
      progress: body.progress ?? 0,
    })
    .returning();
  res.status(201).json({
    ...row,
    budget: Number(row.budget),
    createdAt: row.createdAt.toISOString(),
  });
});

router.patch("/projects/:id", async (req, res) => {
  const { id } = GetProjectParams.parse(req.params);
  const body = UpdateProjectBody.parse(req.body);
  const update: Record<string, unknown> = { ...body };
  if (body.budget !== undefined) update.budget = String(body.budget);
  const [row] = await db
    .update(projectsTable)
    .set(update)
    .where(eq(projectsTable.id, id))
    .returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({
    ...row,
    budget: Number(row.budget),
    createdAt: row.createdAt.toISOString(),
  });
});

router.delete("/projects/:id", async (req, res) => {
  const { id } = GetProjectParams.parse(req.params);
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  res.status(204).end();
});

export default router;
