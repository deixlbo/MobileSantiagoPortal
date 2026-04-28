import { Router, type IRouter } from "express";
import { db, blotterReportsTable } from "@workspace/db";
import {
  CreateBlotterReportBody,
  GetBlotterReportParams,
  UpdateBlotterReportBody,
  ListBlotterReportsQueryParams,
} from "@workspace/api-zod";
import { eq, sql, ilike, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/blotter", async (req, res) => {
  const params = ListBlotterReportsQueryParams.parse(req.query);
  const conds = [];
  if (params.search) conds.push(ilike(blotterReportsTable.reporter, `%${params.search}%`));
  if (params.status) conds.push(eq(blotterReportsTable.status, params.status));
  if (params.category) conds.push(eq(blotterReportsTable.category, params.category));
  const rows = await db
    .select()
    .from(blotterReportsTable)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(blotterReportsTable.id);
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.get("/blotter/stats", async (_req, res) => {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      pending: sql<number>`count(*) filter (where status = 'pending')::int`,
      investigating: sql<number>`count(*) filter (where status = 'investigating')::int`,
      resolved: sql<number>`count(*) filter (where status = 'resolved')::int`,
    })
    .from(blotterReportsTable);
  res.json(row);
});

router.get("/blotter/:id", async (req, res) => {
  const { id } = GetBlotterReportParams.parse(req.params);
  const [row] = await db.select().from(blotterReportsTable).where(eq(blotterReportsTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.post("/blotter", async (req, res) => {
  const body = CreateBlotterReportBody.parse(req.body);
  const refNo = `RES-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
  const [row] = await db
    .insert(blotterReportsTable)
    .values({ ...body, referenceNo: refNo, status: body.status ?? "pending" })
    .returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/blotter/:id", async (req, res) => {
  const { id } = GetBlotterReportParams.parse(req.params);
  const body = UpdateBlotterReportBody.parse(req.body);
  const [row] = await db
    .update(blotterReportsTable)
    .set(body)
    .where(eq(blotterReportsTable.id, id))
    .returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/blotter/:id", async (req, res) => {
  const { id } = GetBlotterReportParams.parse(req.params);
  await db.delete(blotterReportsTable).where(eq(blotterReportsTable.id, id));
  res.status(204).end();
});

export default router;
