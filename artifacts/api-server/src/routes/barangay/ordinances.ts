import { Router } from "express";
import { db } from "@workspace/db";
import { ordinances } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(ordinances).orderBy(ordinances.createdAt);
    res.json(rows.reverse());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(ordinances).where(eq(ordinances.id, req.params.id));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/", async (req, res) => {
  try {
    const [row] = await db.insert(ordinances).values(req.body).returning();
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [row] = await db.update(ordinances).set(req.body).where(eq(ordinances.id, req.params.id)).returning();
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(ordinances).where(eq(ordinances.id, req.params.id));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
