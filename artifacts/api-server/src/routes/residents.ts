import { Router, type IRouter } from "express";
import { db, residentsTable } from "@workspace/db";
import {
  CreateResidentBody,
  GetResidentParams,
  UpdateResidentBody,
  ListResidentsQueryParams,
} from "@workspace/api-zod";
import { eq, sql, ilike, and, gte } from "drizzle-orm";

const router: IRouter = Router();

router.get("/residents", async (req, res) => {
  const params = ListResidentsQueryParams.parse(req.query);
  const conds = [];
  if (params.search) conds.push(ilike(residentsTable.fullName, `%${params.search}%`));
  if (params.purok) conds.push(eq(residentsTable.purok, params.purok));
  if (params.status) conds.push(eq(residentsTable.status, params.status));
  const rows = await db
    .select()
    .from(residentsTable)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(residentsTable.id);
  res.json(
    rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  );
});

router.get("/residents/lookup", async (req, res) => {
  const email = String(req.query["email"] ?? "").trim().toLowerCase();
  if (!email) return res.status(400).json({ error: "email required" });
  const rows = await db.select().from(residentsTable);
  const found = rows.find((r) => r.email.toLowerCase() === email);
  if (!found) return res.status(404).json({ error: "Resident not found" });
  res.json({ ...found, createdAt: found.createdAt.toISOString() });
});

router.get("/residents/stats", async (_req, res) => {
  const [totals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where status = 'active')::int`,
      pending: sql<number>`count(*) filter (where status = 'pending')::int`,
    })
    .from(residentsTable);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const [monthRow] = await db
    .select({ thisMonth: sql<number>`count(*)::int` })
    .from(residentsTable)
    .where(gte(residentsTable.createdAt, startOfMonth));

  const byPurokRows = await db
    .select({
      purok: residentsTable.purok,
      count: sql<number>`count(*)::int`,
    })
    .from(residentsTable)
    .groupBy(residentsTable.purok)
    .orderBy(residentsTable.purok);

  res.json({
    total: totals?.total ?? 0,
    active: totals?.active ?? 0,
    pending: totals?.pending ?? 0,
    thisMonth: monthRow?.thisMonth ?? 0,
    byPurok: byPurokRows,
  });
});

router.get("/residents/:id", async (req, res) => {
  const { id } = GetResidentParams.parse(req.params);
  const [row] = await db.select().from(residentsTable).where(eq(residentsTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.post("/residents", async (req, res) => {
  const body = CreateResidentBody.parse(req.body);
  const [row] = await db
    .insert(residentsTable)
    .values({ ...body, status: body.status ?? "pending" })
    .returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/residents/:id", async (req, res) => {
  const { id } = GetResidentParams.parse(req.params);
  const body = UpdateResidentBody.parse(req.body);
  const [row] = await db
    .update(residentsTable)
    .set(body)
    .where(eq(residentsTable.id, id))
    .returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/residents/:id", async (req, res) => {
  const { id } = GetResidentParams.parse(req.params);
  await db.delete(residentsTable).where(eq(residentsTable.id, id));
  res.status(204).end();
});

export default router;
