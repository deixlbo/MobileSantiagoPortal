import { Router } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db";
import { eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";

const openaiRouter = Router();

const BARANGAY_SYSTEM_PROMPT = `You are a helpful assistant for Barangay Santiago Saz Management System. 
You help residents and officials understand processes, requirements, and procedures for barangay services.

You know about the following services and their requirements:

DOCUMENT REQUESTS:
- Barangay Clearance: Valid ID, Proof of Residency, 2x2 photo
- Certificate of Indigency: Valid ID, Proof of Income, Letter of Request
- Certificate of Residency: Valid ID, Proof of Residency (utility bill/lease)
- Business Clearance: DTI/SEC Registration, Valid ID, Lease Contract
- Certificate of Good Moral Character: Valid ID, 2x2 photo, Recommendation Letter

REGISTRATION PROCESS:
- Fill out registration form with Full Name, Email, Phone, Address, Purok
- Upload a valid ID (National ID, Driver's License, Passport, Voter's ID, SSS/GSIS ID)
- Wait for barangay official approval (usually 1-3 business days)
- You will receive an email when your account is approved

BLOTTER FILING:
- Provide incident description, date, and time
- Mark location on the map
- Upload evidence (optional)
- Officials will review and schedule mediation if needed
- Both parties will be notified with schedule details

ANNOUNCEMENTS & PROGRAMS:
- Barangay announcements are posted regularly
- Programs include livelihood, health, and community development
- Check the announcements page for updates

GENERAL INFORMATION:
- Office Hours: Monday to Friday, 8:00 AM - 5:00 PM
- Emergency contact: Barangay Hall hotline
- All requests are processed within 3-5 business days
- You can track your request status in the portal

Be friendly, clear, and helpful. Answer in a conversational tone. If asked something outside barangay services, politely redirect to barangay-related topics.`;

openaiRouter.get("/conversations", async (req, res) => {
  try {
    const result = await db.select().from(conversations).orderBy(conversations.createdAt);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to list conversations" });
  }
});

openaiRouter.post("/conversations", async (req, res) => {
  try {
    const { title } = req.body;
    const [created] = await db.insert(conversations).values({ title: title ?? "New Chat" }).returning();
    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create conversation" });
  }
});

openaiRouter.get("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) return res.status(404).json({ error: "Conversation not found" });
    const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
    return res.json({ ...conv, messages: msgs });
  } catch (error) {
    return res.status(500).json({ error: "Failed to get conversation" });
  }
});

openaiRouter.delete("/conversations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(messages).where(eq(messages.conversationId, id));
    const deleted = await db.delete(conversations).where(eq(conversations.id, id)).returning();
    if (!deleted.length) return res.status(404).json({ error: "Conversation not found" });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete conversation" });
  }
});

openaiRouter.get("/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const msgs = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);
    return res.json(msgs);
  } catch (error) {
    return res.status(500).json({ error: "Failed to list messages" });
  }
});

openaiRouter.post("/conversations/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { content } = req.body;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) return res.status(404).json({ error: "Conversation not found" });

    await db.insert(messages).values({ conversationId: id, role: "user", content });

    const history = await db.select().from(messages).where(eq(messages.conversationId, id)).orderBy(messages.createdAt);

    const chatMessages = [
      { role: "system" as const, content: BARANGAY_SYSTEM_PROMPT },
      ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    const stream = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const part = chunk.choices[0]?.delta?.content;
      if (part) {
        fullResponse += part;
        res.write(`data: ${JSON.stringify({ content: part })}\n\n`);
      }
    }

    await db.insert(messages).values({ conversationId: id, role: "assistant", content: fullResponse });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    return res.end();
  } catch (error) {
    console.error("OpenAI chat error:", error);
    res.write(`data: ${JSON.stringify({ error: "Failed to get response" })}\n\n`);
    return res.end();
  }
});

export default openaiRouter;
