import { Router } from "express";
import { db } from "@workspace/db";
import {
  announcements, ordinances, documentRequests, blotterCases,
  projects, residents, assets, businesses, users
} from "@workspace/db/schema";

const router = Router();

router.post("/seed", async (req, res) => {
  try {
    // Clear existing data
    await db.delete(blotterCases);
    await db.delete(documentRequests);
    await db.delete(ordinances);
    await db.delete(announcements);
    await db.delete(projects);
    await db.delete(assets);
    await db.delete(businesses);
    await db.delete(residents);
    await db.delete(users);

    await db.insert(users).values([
      { id: "res-001", email: "juan@email.com", fullName: "Juan dela Cruz", role: "resident", address: "Purok 1, Barangay Santiago", phone: "09123456789", purok: "Purok 1 - Mabini" },
      { id: "res-002", email: "maria@email.com", fullName: "Maria Santos", role: "resident", address: "Purok 2, Barangay Santiago", phone: "09987654321", purok: "Purok 2 - Rizal" },
      { id: "res-003", email: "pedro@email.com", fullName: "Pedro Cruz", role: "resident", address: "Purok 3, Barangay Santiago", phone: "09876543210", purok: "Purok 3 - Bonifacio" },
      { id: "res-004", email: "ana@email.com", fullName: "Ana Torres", role: "resident", address: "Purok 4, Barangay Santiago", phone: "09765432109", purok: "Purok 4 - Aguinaldo" },
      { id: "res-005", email: "carlos@email.com", fullName: "Carlos Reyes", role: "resident", address: "Purok 5, Barangay Santiago", phone: "09654321098", purok: "Purok 5 - Bagong Buhay" },
      { id: "off-001", email: "captain@brgy-santiago.gov.ph", fullName: "Hon. Rolando C. Borja", role: "official", address: "Barangay Hall", phone: "0912-345-6789" },
      { id: "off-002", email: "secretary@brgy-santiago.gov.ph", fullName: "Sec. Maria D. Santos", role: "official", address: "Barangay Hall", phone: "0923-456-7890" },
      { id: "off-003", email: "councilor1@brgy-santiago.gov.ph", fullName: "Hon. Jose L. Reyes", role: "official", address: "Barangay Hall", phone: "0934-567-8901" },
      { id: "off-004", email: "councilor2@brgy-santiago.gov.ph", fullName: "Hon. Ana Maria Reyes", role: "official", address: "Barangay Hall", phone: "0945-678-9012" },
      { id: "off-005", email: "councilor3@brgy-santiago.gov.ph", fullName: "Hon. Mark Santos", role: "official", address: "Barangay Hall", phone: "0956-789-0123" },
      { id: "off-006", email: "treasurer@brgy-santiago.gov.ph", fullName: "Treas. Carlo Aquino", role: "official", address: "Barangay Hall", phone: "0967-890-1234" },
    ]);

    await db.insert(announcements).values([
      { id: "ann-001", title: "Clean-Up Drive - April 13, 2026", content: "All residents are invited to join the Clean-Up Drive on April 13, 2026 at 6:00 AM. Assembly at Barangay Hall.", category: "Event", priority: "medium", date: "2026-04-09", author: "Kap. Rolando C. Borja" },
      { id: "ann-002", title: "Free Medical Mission", content: "The barangay in partnership with the Municipality of San Antonio will hold a Free Medical Mission on April 20, 2026.", category: "Event", priority: "high", date: "2026-04-07", author: "Kap. Rolando C. Borja" },
      { id: "ann-003", title: "Water Supply Interruption Notice", content: "MAYNILAD will conduct maintenance work on April 15, 2026 from 8:00 AM to 5:00 PM. Water supply will be interrupted in Puroks 1-3.", category: "Maintenance", priority: "high", date: "2026-04-05", author: "Sec. Maria D. Santos" },
      { id: "ann-004", title: "Barangay Assembly - April 28, 2026", content: "Mandatory General Assembly for all Barangay Officials and Household Representatives on April 28, 2026 at 9:00 AM.", category: "Meeting", priority: "high", date: "2026-04-03", author: "Sec. Maria D. Santos" },
      { id: "ann-005", title: "Summer Sports Festival Registration", content: "Registration for the Barangay Summer Sports Festival is now open! Events include basketball, volleyball, badminton, and swimming.", category: "Event", priority: "low", date: "2026-04-01", author: "Coun. Mark Santos" },
    ]);

    await db.insert(ordinances).values([
      { id: "ORD-001", number: "BO-2026-001", title: "AN ORDINANCE REGULATING NOISE POLLUTION IN BARANGAY SANTIAGO", type: "Ordinance", dateEnacted: "2026-01-15", author: "Hon. Rolando C. Borja", status: "Active", summary: "Establishes noise level standards and penalties for violations within the barangay.", fullText: `Section 1. Title. This ordinance shall be known as the "Barangay Santiago Noise Control Ordinance of 2026."\n\nSection 2. Declaration of Policy. The barangay recognizes the right of every resident to a peaceful and quiet environment.\n\nSection 3. Prohibited Acts. No person shall cause, make, or allow noise in excess of 60 decibels between 10:00 PM and 6:00 AM.\n\nSection 4. Penalties. First offense: Warning. Second offense: ₱500.00 fine. Third offense: ₱1,000.00 fine and community service.\n\nSection 5. Effectivity. This ordinance shall take effect upon approval.` },
      { id: "ORD-002", number: "BRes-2026-001", title: "RESOLUTION AUTHORIZING THE BARANGAY CAPTAIN TO ENTER INTO A MEMORANDUM OF AGREEMENT", type: "Resolution", dateEnacted: "2026-01-28", author: "Barangay Council", status: "Active", summary: "Authorizes the Barangay Captain to sign a MOA with TESDA for livelihood programs.", fullText: `WHEREAS, the Barangay desires to improve the livelihood opportunities of its constituents;\n\nWHEREAS, TESDA has expressed willingness to conduct training programs;\n\nNOW THEREFORE BE IT RESOLVED, as it is hereby resolved to authorize the Barangay Captain to enter into a Memorandum of Agreement with TESDA.` },
      { id: "ORD-003", number: "BO-2025-012", title: "AN ORDINANCE ESTABLISHING A BARANGAY SCHOLARSHIP PROGRAM", type: "Ordinance", dateEnacted: "2025-11-10", author: "Hon. Ana Maria Reyes", status: "Active", summary: "Creates a scholarship fund for financially-challenged college students from the barangay.", fullText: `Section 1. There is hereby established the Barangay Santiago Scholarship Program.\n\nSection 2. Coverage. Qualified college students who are bona fide residents of Barangay Santiago.\n\nSection 3. Benefits. Monthly stipend of ₱2,000 and book allowance of ₱3,000 per semester.\n\nSection 4. Funding. An annual appropriation of ₱200,000 shall be allocated from the barangay budget.` },
    ]);

    await db.insert(documentRequests).values([
      { id: "doc-001", residentId: "res-001", residentName: "Juan dela Cruz", documentType: "Barangay Clearance", purpose: "Job application", status: "approved", date: "2026-04-01", address: "Purok 1, Barangay Santiago", notes: "Ready for release" },
      { id: "doc-002", residentId: "res-002", residentName: "Maria Santos", documentType: "Certificate of Indigency", purpose: "PhilHealth application", status: "pending", date: "2026-04-05", address: "Purok 2, Barangay Santiago", notes: "" },
      { id: "doc-003", residentId: "res-003", residentName: "Pedro Cruz", documentType: "Certificate of Residency", purpose: "School enrollment", status: "processing", date: "2026-04-07", address: "Purok 3, Barangay Santiago", notes: "Under review" },
      { id: "doc-004", residentId: "res-004", residentName: "Ana Torres", documentType: "Business Permit", purpose: "Sari-sari store renewal", status: "rejected", date: "2026-03-28", address: "Purok 4, Barangay Santiago", notes: "Missing requirements: Fire Safety Certificate" },
    ]);

    await db.insert(blotterCases).values([
      { id: "BLT-0031", incidentType: "Noise Complaint", location: "Purok 1 - Mabini", reportedBy: "Maria Santos", reportedById: "res-002", respondent: "Jose Reyes", status: "investigating", date: "2026-04-01", time: "14:30", description: "Loud music from neighbor's house disturbing peace.", narrative: "Respondent was playing loud music past midnight on multiple occasions.", witnesses: ["Carlos Mañago"], notifyParties: true, assignedTo: "Kap. Rolando Borja" },
      { id: "BLT-0030", incidentType: "Property Dispute", location: "Purok 2 - Rizal", reportedBy: "Juan dela Cruz", reportedById: "res-001", respondent: "Pedro Villanueva", status: "mediation", date: "2026-03-28", time: "09:15", description: "Dispute over boundary of property.", narrative: "Complainant alleges respondent constructed fence beyond their legal boundary.", witnesses: ["Anna Cruz", "Ben Torres"], notifyParties: true, assignedTo: "Kap. Rolando Borja" },
      { id: "BLT-0029", incidentType: "Theft", location: "Purok 3 - Bonifacio", reportedBy: "Ana Torres", reportedById: "res-003", status: "reported", date: "2026-03-25", time: "22:45", description: "Motorcycle stolen from residence.", narrative: "Complainant's motorcycle was taken from their front yard.", witnesses: [], notifyParties: true },
      { id: "BLT-0028", incidentType: "Verbal Abuse", location: "Purok 4 - Aguinaldo", reportedBy: "Rosa Magtoto", reportedById: "res-004", respondent: "Victor Cabarles", status: "resolved", date: "2026-03-20", time: "11:00", description: "Verbal altercation in the marketplace.", narrative: "Respondent hurled insults at complainant in public.", witnesses: ["Marco Garcia"], notifyParties: false, assignedTo: "Kap. Rolando Borja", resolution: "Parties reconciled through mediation." },
      { id: "BLT-0027", incidentType: "Domestic Issue", location: "Purok 5 - Bagong Buhay", reportedBy: "Elena Soriano", reportedById: "res-005", status: "escalated", date: "2026-03-15", time: "03:30", description: "Domestic disturbance reported by neighbor.", narrative: "Repeated domestic incidents. Referred to higher authority.", witnesses: ["Nena Alcantara"], notifyParties: true, assignedTo: "PNP San Antonio" },
    ]);

    await db.insert(projects).values([
      { id: "PRJ-001", title: "Feeding Program 2026", description: "Monthly feeding program for malnourished children and senior citizens.", category: "Health & Nutrition", status: "ongoing", startDate: "2026-01-15", endDate: "2026-12-15", location: "All Puroks", budget: "150000", actualCost: "45000", leadBy: "Kap. Rolando C. Borja", beneficiaries: 120, requirements: ["Food supplies", "Volunteer coordinators"], milestones: [{ name: "Program Launch", date: "2026-01-15", status: "completed" }, { name: "Q1 Distribution", date: "2026-03-31", status: "completed" }, { name: "Q2 Distribution", date: "2026-06-30", status: "pending" }], fundSource: "Barangay Development Fund" },
      { id: "PRJ-002", title: "Road Rehabilitation - Purok 3", description: "Repair and improvement of damaged roads in Purok 3 Bonifacio.", category: "Infrastructure", status: "planning", startDate: "2026-05-01", endDate: "2026-07-31", location: "Purok 3 - Bonifacio", budget: "500000", actualCost: "0", leadBy: "Coun. Jose L. Reyes", beneficiaries: 350, contractor: "JMRC Construction", requirements: ["DPWH Clearance"], milestones: [{ name: "Planning & Design", date: "2026-04-30", status: "completed" }, { name: "Procurement", date: "2026-05-15", status: "pending" }], fundSource: "20% Development Fund" },
      { id: "PRJ-003", title: "Livelihood Training: Handicrafts", description: "Skills training for unemployed residents in handicraft production.", category: "Livelihood", status: "completed", startDate: "2026-02-01", endDate: "2026-03-31", location: "Barangay Hall", budget: "80000", actualCost: "72000", leadBy: "Coun. Ana Maria Reyes", beneficiaries: 45, requirements: ["Training materials"], milestones: [{ name: "Registration", date: "2026-02-01", status: "completed" }, { name: "Certification", date: "2026-03-31", status: "completed" }], fundSource: "TESDA Grant" },
      { id: "PRJ-004", title: "Basketball Court Renovation", description: "Renovation of the barangay basketball court with new flooring and lighting.", category: "Sports & Recreation", status: "ongoing", startDate: "2026-03-01", endDate: "2026-04-30", location: "Covered Court, Santiago", budget: "200000", actualCost: "120000", leadBy: "Coun. Mark Santos", beneficiaries: 800, contractor: "BrightBuild Corp", requirements: ["Building permit"], milestones: [{ name: "Floor Works", date: "2026-03-31", status: "completed" }, { name: "Lighting Installation", date: "2026-04-20", status: "pending" }], fundSource: "Barangay Development Fund" },
    ]);

    await db.insert(residents).values([
      { id: "RES-001", name: "Juan dela Cruz", email: "juan@email.com", phone: "09123456789", address: "Purok 1, Barangay Santiago", birthDate: "1990-05-15", gender: "Male", civilStatus: "Married", status: "active" },
      { id: "RES-002", name: "Maria Santos", email: "maria@email.com", phone: "09987654321", address: "Purok 2, Barangay Santiago", birthDate: "1985-09-22", gender: "Female", civilStatus: "Single", status: "active" },
      { id: "RES-003", name: "Pedro Cruz", email: "pedro@email.com", phone: "09876543210", address: "Purok 3, Barangay Santiago", birthDate: "1978-12-01", gender: "Male", civilStatus: "Married", status: "active" },
      { id: "RES-004", name: "Ana Torres", email: "ana@email.com", phone: "09765432109", address: "Purok 4, Barangay Santiago", birthDate: "1995-03-18", gender: "Female", civilStatus: "Single", status: "inactive" },
      { id: "RES-005", name: "Carlos Reyes", email: "carlos@email.com", phone: "09654321098", address: "Purok 5, Barangay Santiago", birthDate: "1968-07-30", gender: "Male", civilStatus: "Widowed", status: "active" },
    ]);

    await db.insert(assets).values([
      { id: "AST-001", name: "Barangay Multi-Purpose Vehicle", category: "Vehicle", description: "Toyota Hi-Ace Van for community transport", acquisitionDate: "2022-06-15", acquisitionCost: "1200000", condition: "Good", location: "Barangay Hall Garage", accountableOfficer: "Hon. Rolando C. Borja", serialNumber: "TAV-2022-001" },
      { id: "AST-002", name: "Desktop Computer Set", category: "IT Equipment", description: "Office computer with complete peripherals", acquisitionDate: "2023-01-10", acquisitionCost: "45000", condition: "Excellent", location: "Barangay Hall Office", accountableOfficer: "Sec. Maria D. Santos", serialNumber: "CPU-2023-001" },
      { id: "AST-003", name: "Generator Set (10KVA)", category: "Equipment", description: "Emergency power generator", acquisitionDate: "2021-08-20", acquisitionCost: "85000", condition: "Fair", location: "Barangay Hall Basement", accountableOfficer: "Hon. Rolando C. Borja", serialNumber: "GEN-2021-001" },
      { id: "AST-004", name: "Conference Table Set", category: "Furniture", description: "12-seater conference table with matching chairs", acquisitionDate: "2020-03-15", acquisitionCost: "35000", condition: "Good", location: "Barangay Hall Conference Room", accountableOfficer: "Sec. Maria D. Santos" },
    ]);

    await db.insert(businesses).values([
      { id: "biz-001", businessName: "Tindahan ni Nena", ownerName: "Elena Soriano", type: "Retail (Sari-Sari Store)", address: "Purok 1, Santiago", permitNumber: "BP-2026-001", status: "active" },
      { id: "biz-002", businessName: "Rosa's Carinderia", ownerName: "Rosa Magtoto", type: "Food & Beverage", address: "Purok 2, Santiago", permitNumber: "BP-2026-002", status: "active" },
      { id: "biz-003", businessName: "Santiago Auto Parts", ownerName: "Victor Cabarles", type: "Services", address: "Purok 3, Santiago", permitNumber: "BP-2025-010", status: "expired" },
      { id: "biz-004", businessName: "JV Construction Supply", ownerName: "Jose Villanueva", type: "Construction", address: "Purok 4, Santiago", permitNumber: "", status: "pending" },
    ]);

    return res.json({ success: true, message: "Database seeded successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
});

export default router;
