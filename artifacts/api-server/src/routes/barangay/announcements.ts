import { Router } from "express";
import { db } from "@workspace/db";
import { announcements } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(announcements).orderBy(announcements.createdAt);
    return res.json(rows.reverse());
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(announcements).where(eq(announcements.id, req.params.id));
    if (!row) return res.status(404).json({ error: "Not found" });
    return res.json(row);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

router.post("/", async (req, res) => {
  try {
    const [row] = await db.insert(announcements).values(req.body).returning();
    return res.status(201).json(row);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [row] = await db.update(announcements).set(req.body).where(eq(announcements.id, req.params.id)).returning();
    return res.json(row);
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.delete(announcements).where(eq(announcements.id, req.params.id));
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
});

export default router;
