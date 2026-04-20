import { Router } from "express";
import { db } from "@workspace/db";
import { blotterCases } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { reportedById } = req.query;
    let rows;
    if (reportedById) {
      rows = await db.select().from(blotterCases).where(eq(blotterCases.reportedById, reportedById as string));
    } else {
      rows = await db.select().from(blotterCases);
    }
    return res.json(rows.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)));
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(blotterCases).where(eq(blotterCases.id, req.params.id));
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(row);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

router.post("/", async (req, res) => {
  try {
    const [row] = await db.insert(blotterCases).values(req.body).returning();
    return res.status(201).json(row);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [row] = await db.update(blotterCases).set(req.body).where(eq(blotterCases.id, req.params.id)).returning();
    return res.json(row);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(blotterCases).where(eq(blotterCases.id, req.params.id));
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

export default router;
