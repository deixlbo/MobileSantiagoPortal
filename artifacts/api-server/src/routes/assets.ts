import { Router, type IRouter } from "express";
import { db, assetsTable } from "@workspace/db";
import {
  CreateAssetBody,
  GetAssetParams,
  UpdateAssetBody,
  ListAssetsQueryParams,
} from "@workspace/api-zod";
import { eq, sql, ilike, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/assets", async (req, res) => {
  const params = ListAssetsQueryParams.parse(req.query);
  const conds = [];
  if (params.search) conds.push(ilike(assetsTable.fileName, `%${params.search}%`));
  if (params.type) conds.push(eq(assetsTable.type, params.type));
  const rows = await db
    .select()
    .from(assetsTable)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(assetsTable.id);
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.get("/assets/stats", async (_req, res) => {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      documents: sql<number>`count(*) filter (where type = 'document')::int`,
      images: sql<number>`count(*) filter (where type = 'image')::int`,
      videos: sql<number>`count(*) filter (where type = 'video')::int`,
    })
    .from(assetsTable);
  res.json(row);
});

router.get("/assets/:id", async (req, res) => {
  const { id } = GetAssetParams.parse(req.params);
  const [row] = await db.select().from(assetsTable).where(eq(assetsTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.post("/assets", async (req, res) => {
  const body = CreateAssetBody.parse(req.body);
  const [row] = await db
    .insert(assetsTable)
    .values({
      ...body,
      uploadedDate: body.uploadedDate ?? new Date().toISOString().slice(0, 10),
    })
    .returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/assets/:id", async (req, res) => {
  const { id } = GetAssetParams.parse(req.params);
  const body = UpdateAssetBody.parse(req.body);
  const [row] = await db
    .update(assetsTable)
    .set(body)
    .where(eq(assetsTable.id, id))
    .returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/assets/:id", async (req, res) => {
  const { id } = GetAssetParams.parse(req.params);
  await db.delete(assetsTable).where(eq(assetsTable.id, id));
  res.status(204).end();
});

export default router;
