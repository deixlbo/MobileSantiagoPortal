import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  residentsTable,
  blotterReportsTable,
  projectsTable,
  announcementsTable,
  ordinancesTable,
  documentRequestsTable,
  assetsTable,
} from "@workspace/db/schema";
import { sql, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res) => {
  const [r] = await db
    .select({
      totalResidents: sql<number>`count(*)::int`,
      activeResidents: sql<number>`count(*) filter (where status = 'active')::int`,
      pendingResidents: sql<number>`count(*) filter (where status = 'pending')::int`,
    })
    .from(residentsTable);

  const [b] = await db
    .select({
      totalBlotterReports: sql<number>`count(*)::int`,
      pendingBlotterReports: sql<number>`count(*) filter (where status = 'pending')::int`,
      investigatingBlotterReports: sql<number>`count(*) filter (where status = 'investigating')::int`,
    })
    .from(blotterReportsTable);

  const [p] = await db
    .select({
      totalProjects: sql<number>`count(*)::int`,
      ongoingProjects: sql<number>`count(*) filter (where status = 'ongoing')::int`,
      completedProjects: sql<number>`count(*) filter (where status = 'completed')::int`,
    })
    .from(projectsTable);

  const [a] = await db
    .select({
      totalAnnouncements: sql<number>`count(*)::int`,
      publishedAnnouncements: sql<number>`count(*) filter (where status = 'published')::int`,
    })
    .from(announcementsTable);

  const [o] = await db
    .select({
      totalOrdinances: sql<number>`count(*)::int`,
      enactedOrdinances: sql<number>`count(*) filter (where status = 'enacted')::int`,
    })
    .from(ordinancesTable);

  const [d] = await db
    .select({
      totalDocumentRequests: sql<number>`count(*)::int`,
      pendingDocumentRequests: sql<number>`count(*) filter (where status = 'pending')::int`,
    })
    .from(documentRequestsTable);

  const [as] = await db
    .select({ totalAssets: sql<number>`count(*)::int` })
    .from(assetsTable);

  res.json({ ...r, ...b, ...p, ...a, ...o, ...d, ...as });
});

router.get("/dashboard/activity", async (_req, res) => {
  const items: Array<{
    id: string;
    kind: string;
    title: string;
    description: string;
    timestamp: string;
  }> = [];

  const recentResidents = await db
    .select()
    .from(residentsTable)
    .orderBy(desc(residentsTable.createdAt))
    .limit(3);
  for (const r of recentResidents) {
    items.push({
      id: `resident-${r.id}`,
      kind: "resident",
      title: "New resident registered",
      description: `${r.fullName} from ${r.purok}`,
      timestamp: r.createdAt.toISOString(),
    });
  }

  const recentBlotter = await db
    .select()
    .from(blotterReportsTable)
    .orderBy(desc(blotterReportsTable.createdAt))
    .limit(3);
  for (const b of recentBlotter) {
    items.push({
      id: `blotter-${b.id}`,
      kind: "blotter",
      title: `Blotter report: ${b.category}`,
      description: `${b.referenceNo} reported by ${b.reporter}`,
      timestamp: b.createdAt.toISOString(),
    });
  }

  const recentDocs = await db
    .select()
    .from(documentRequestsTable)
    .orderBy(desc(documentRequestsTable.createdAt))
    .limit(3);
  for (const d of recentDocs) {
    items.push({
      id: `document-${d.id}`,
      kind: "document",
      title: `Document request: ${d.documentType}`,
      description: `${d.referenceNo} by ${d.residentName}`,
      timestamp: d.createdAt.toISOString(),
    });
  }

  const recentAnnouncements = await db
    .select()
    .from(announcementsTable)
    .orderBy(desc(announcementsTable.createdAt))
    .limit(3);
  for (const a of recentAnnouncements) {
    items.push({
      id: `announcement-${a.id}`,
      kind: "announcement",
      title: `Announcement: ${a.title}`,
      description: a.content.slice(0, 80),
      timestamp: a.createdAt.toISOString(),
    });
  }

  items.sort((x, y) => (y.timestamp > x.timestamp ? 1 : -1));
  res.json(items.slice(0, 10));
});

export default router;
