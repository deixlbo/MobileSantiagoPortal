import { Router, type IRouter } from "express";
import { db, documentRequestsTable, documentCategoriesTable } from "@workspace/db";
import {
  CreateDocumentRequestBody,
  GetDocumentRequestParams,
  UpdateDocumentRequestBody,
  ListDocumentRequestsQueryParams,
} from "@workspace/api-zod";
import { eq, sql, ilike, and } from "drizzle-orm";

const router: IRouter = Router();

router.get("/documents", async (req, res) => {
  const params = ListDocumentRequestsQueryParams.parse(req.query);
  const conds = [];
  if (params.search) conds.push(ilike(documentRequestsTable.residentName, `%${params.search}%`));
  if (params.status) conds.push(eq(documentRequestsTable.status, params.status));
  if (params.type) conds.push(eq(documentRequestsTable.documentType, params.type));
  const rows = await db
    .select()
    .from(documentRequestsTable)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(documentRequestsTable.id);
  res.json(
    rows.map((r) => ({
      ...r,
      price: Number(r.price),
      createdAt: r.createdAt.toISOString(),
    })),
  );
});

router.get("/documents/categories", async (_req, res) => {
  const rows = await db.select().from(documentCategoriesTable).orderBy(documentCategoriesTable.id);
  res.json(rows.map((r) => ({ ...r, price: Number(r.price) })));
});

router.get("/documents/stats", async (_req, res) => {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      pending: sql<number>`count(*) filter (where status = 'pending')::int`,
      processing: sql<number>`count(*) filter (where status = 'processing')::int`,
      ready: sql<number>`count(*) filter (where status = 'ready')::int`,
      claimed: sql<number>`count(*) filter (where status = 'claimed')::int`,
    })
    .from(documentRequestsTable);
  res.json(row);
});

router.get("/documents/:id", async (req, res) => {
  const { id } = GetDocumentRequestParams.parse(req.params);
  const [row] = await db.select().from(documentRequestsTable).where(eq(documentRequestsTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({ ...row, price: Number(row.price), createdAt: row.createdAt.toISOString() });
});

router.post("/documents", async (req, res) => {
  const body = CreateDocumentRequestBody.parse(req.body);
  const year = new Date().getFullYear();
  const rand = () => String(Math.floor(Math.random() * 900000) + 100000);
  const refNo = `DOC-${year}-${rand()}`;
  const controlNo = `BSC-${year}-${rand().slice(0, 4)}`;
  const orNumber = `OR-${year}-${rand().slice(0, 5)}`;
  const insert: Record<string, unknown> = {
    ...body,
    price: String(body.price),
    referenceNo: refNo,
    controlNo,
    orNumber,
    status: body.status ?? "pending",
    requestedDate: body.requestedDate ?? new Date().toISOString().slice(0, 10),
  };
  if (body.residentId !== undefined && body.residentId !== null) {
    insert["residentId"] = String(body.residentId);
  } else {
    delete insert["residentId"];
  }
  const [row] = await db.insert(documentRequestsTable).values(insert).returning();
  res.status(201).json({
    ...row,
    price: Number(row.price),
    residentId: row.residentId ? Number(row.residentId) : undefined,
    createdAt: row.createdAt.toISOString(),
  });
});

router.patch("/documents/:id", async (req, res) => {
  const { id } = GetDocumentRequestParams.parse(req.params);
  const body = UpdateDocumentRequestBody.parse(req.body);
  const update: Record<string, unknown> = { ...body };
  if (body.price !== undefined) update.price = String(body.price);
  if (body.residentId !== undefined) {
    update["residentId"] = body.residentId === null ? null : String(body.residentId);
  }
  const [row] = await db
    .update(documentRequestsTable)
    .set(update)
    .where(eq(documentRequestsTable.id, id))
    .returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({
    ...row,
    price: Number(row.price),
    residentId: row.residentId ? Number(row.residentId) : undefined,
    createdAt: row.createdAt.toISOString(),
  });
});

router.delete("/documents/:id", async (req, res) => {
  const { id } = GetDocumentRequestParams.parse(req.params);
  await db.delete(documentRequestsTable).where(eq(documentRequestsTable.id, id));
  res.status(204).end();
});

export default router;
