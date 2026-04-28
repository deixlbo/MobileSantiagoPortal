import { Router, type IRouter } from "express";
import { db, announcementsTable } from "@workspace/db";
import {
  CreateAnnouncementBody,
  GetAnnouncementParams,
  UpdateAnnouncementBody,
  ListAnnouncementsQueryParams,
} from "@workspace/api-zod";
import { eq, sql, ilike, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/announcements", async (req, res) => {
  const params = ListAnnouncementsQueryParams.parse(req.query);
  const conds = [];
  if (params.search) conds.push(ilike(announcementsTable.title, `%${params.search}%`));
  if (params.type) conds.push(eq(announcementsTable.type, params.type));
  if (params.status) conds.push(eq(announcementsTable.status, params.status));
  const rows = await db
    .select()
    .from(announcementsTable)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(announcementsTable.id);
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.get("/announcements/stats", async (_req, res) => {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where status = 'published')::int`,
      draft: sql<number>`count(*) filter (where status = 'draft')::int`,
      events: sql<number>`count(*) filter (where type = 'Event')::int`,
    })
    .from(announcementsTable);
  res.json(row);
});

router.get("/announcements/:id", async (req, res) => {
  const { id } = GetAnnouncementParams.parse(req.params);
  const [row] = await db.select().from(announcementsTable).where(eq(announcementsTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.post("/announcements", async (req, res) => {
  const body = CreateAnnouncementBody.parse(req.body);
  const [row] = await db
    .insert(announcementsTable)
    .values({ ...body, status: body.status ?? "published" })
    .returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/announcements/:id", async (req, res) => {
  const { id } = GetAnnouncementParams.parse(req.params);
  const body = UpdateAnnouncementBody.parse(req.body);
  const [row] = await db
    .update(announcementsTable)
    .set(body)
    .where(eq(announcementsTable.id, id))
    .returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/announcements/:id", async (req, res) => {
  const { id } = GetAnnouncementParams.parse(req.params);
  await db.delete(announcementsTable).where(eq(announcementsTable.id, id));
  res.status(204).end();
});

export default router;
