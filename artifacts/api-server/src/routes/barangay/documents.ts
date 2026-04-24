import { Router } from "express";
import { db } from "@workspace/db";
import { documentRequests } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { residentId } = req.query;
    let rows;
    if (residentId) {
      rows = await db.select().from(documentRequests).where(eq(documentRequests.residentId, residentId as string));
    } else {
      rows = await db.select().from(documentRequests);
    }
    res.json(rows.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(documentRequests).where(eq(documentRequests.id, req.params.id));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/", async (req, res) => {
  try {
    const [row] = await db.insert(documentRequests).values(req.body).returning();
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [row] = await db.update(documentRequests).set(req.body).where(eq(documentRequests.id, req.params.id)).returning();
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(documentRequests).where(eq(documentRequests.id, req.params.id));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
