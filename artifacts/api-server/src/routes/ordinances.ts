import { Router, type IRouter } from "express";
import { db, ordinancesTable } from "@workspace/db";
import {
  CreateOrdinanceBody,
  GetOrdinanceParams,
  UpdateOrdinanceBody,
  ListOrdinancesQueryParams,
} from "@workspace/api-zod";
import { eq, sql, ilike, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/ordinances", async (req, res) => {
  const params = ListOrdinancesQueryParams.parse(req.query);
  const conds = [];
  if (params.search) conds.push(ilike(ordinancesTable.title, `%${params.search}%`));
  if (params.status) conds.push(eq(ordinancesTable.status, params.status));
  const rows = await db
    .select()
    .from(ordinancesTable)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(ordinancesTable.id);
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.get("/ordinances/stats", async (_req, res) => {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      enacted: sql<number>`count(*) filter (where status = 'enacted')::int`,
      draft: sql<number>`count(*) filter (where status = 'draft')::int`,
      repealed: sql<number>`count(*) filter (where status = 'repealed')::int`,
    })
    .from(ordinancesTable);
  res.json(row);
});

router.get("/ordinances/:id", async (req, res) => {
  const { id } = GetOrdinanceParams.parse(req.params);
  const [row] = await db.select().from(ordinancesTable).where(eq(ordinancesTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.post("/ordinances", async (req, res) => {
  const body = CreateOrdinanceBody.parse(req.body);
  const [row] = await db
    .insert(ordinancesTable)
    .values({ ...body, status: body.status ?? "draft" })
    .returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/ordinances/:id", async (req, res) => {
  const { id } = GetOrdinanceParams.parse(req.params);
  const body = UpdateOrdinanceBody.parse(req.body);
  const [row] = await db
    .update(ordinancesTable)
    .set(body)
    .where(eq(ordinancesTable.id, id))
    .returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/ordinances/:id", async (req, res) => {
  const { id } = GetOrdinanceParams.parse(req.params);
  await db.delete(ordinancesTable).where(eq(ordinancesTable.id, id));
  res.status(204).end();
});

export default router;
