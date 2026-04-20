import { Router } from "express";
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const rows = await db.select().from(users);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [row] = await db.select().from(users).where(eq(users.id, req.params.id));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/", async (req, res) => {
  try {
    const existing = await db.select().from(users).where(eq(users.email, req.body.email));
    if (existing.length > 0) {
      return res.json(existing[0]);
    }
    const [row] = await db.insert(users).values(req.body).returning();
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [row] = await db.update(users).set(req.body).where(eq(users.id, req.params.id)).returning();
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
