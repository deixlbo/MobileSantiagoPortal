"use client"

import { AIChatbot } from "@/components/ai-chatbot"

const officialSuggestedQuestions = [
  { text: "Ipakita ang pending requests.", category: "requests" },
  { text: "Ilang requests ang na-process ngayon?", category: "reports" },
  { text: "Ipakita ang latest blotter reports.", category: "blotter" },
  { text: "Gumawa ng monthly report.", category: "reports" },
  { text: "Hanapin ang impormasyon ng resident.", category: "residents" },
  { text: "Aling requests ang for approval?", category: "requests" },
  { text: "Ipakita ang urgent requests.", category: "requests" },
  { text: "Mag-post ng bagong announcement.", category: "announcements" },
]

function getOfficialResponse(question: string): string {
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes("pending") && lowerQuestion.includes("request")) {
    return "Mayroong 24 pending document requests na naghihintay ng inyong approval. Breakdown: 12 Barangay Clearance, 8 Certificate of Residency, at 4 Certificate of Indigency. Pumunta sa Documents section para i-review ang mga ito."
  }
  
  if ((lowerQuestion.includes("ilang") || lowerQuestion.includes("how many")) && lowerQuestion.includes("process")) {
    return "Ngayong araw, na-process na ang 15 document requests: 8 Barangay Clearance (approved), 5 Certificate of Residency (approved), at 2 Certificate of Indigency (approved). May 3 rejected requests dahil sa incomplete requirements."
  }
  
  if (lowerQuestion.includes("today") || (lowerQuestion.includes("ngayon") && lowerQuestion.includes("transactions"))) {
    return "Narito ang summary ng transactions ngayong araw: 15 approved requests, 3 rejected requests, 5 new blotter reports filed, at 2 blotter cases resolved. Total collection: Php 1,250.00 mula sa processing fees."
  }

  if (lowerQuestion.includes("monthly") && lowerQuestion.includes("report")) {
    return "Para gumawa ng monthly report, pumunta sa Reports section at i-click ang 'Generate Report'. Piliin ang buwan at taon, at ang uri ng report na gusto ninyo (Document Requests, Blotter Summary, Financial Report, o Complete Summary). Ang report ay maaaring i-export sa PDF o Excel format."
  }
  
  if (lowerQuestion.includes("weekly") && lowerQuestion.includes("report")) {
    return "Para sa weekly report, pumunta sa Reports section. Ngayong linggo: 78 total requests processed, 12 blotter cases handled, at 3 new resident registrations. Ang detailed breakdown ay available sa Reports dashboard."
  }
  
  if (lowerQuestion.includes("statistics") || lowerQuestion.includes("stats") || lowerQuestion.includes("analytics")) {
    return "Narito ang quick statistics: Ngayong buwan may 312 total document requests (89% approval rate), 28 blotter reports (18 resolved), at 15 new resident registrations. Para sa detailed analytics, pumunta sa Reports > Dashboard Analytics."
  }
  
  if ((lowerQuestion.includes("pinaka") || lowerQuestion.includes("most")) && lowerQuestion.includes("request")) {
    return "Ang pinaka-requested na dokumento ngayong buwan ay ang Barangay Clearance (45%), sunod ang Certificate of Residency (30%), Certificate of Indigency (15%), at Business Clearance (10%). Karamihan ng requests ay para sa employment purposes."
  }

  if (lowerQuestion.includes("hanapin") || lowerQuestion.includes("search") || lowerQuestion.includes("find")) {
    if (lowerQuestion.includes("resident")) {
      return "Para hanapin ang impormasyon ng resident, pumunta sa Residents section at gamitin ang search bar. Maaaring mag-search gamit ang pangalan, address, o resident ID. I-click ang profile para makita ang complete information at transaction history."
    }
  }
  
  if (lowerQuestion.includes("update") && lowerQuestion.includes("resident")) {
    return "Para i-update ang resident information, pumunta sa Residents section at hanapin ang profile. I-click ang 'Edit' button at i-update ang kinakailangang fields. Huwag kalimutang i-save ang changes. Ang lahat ng updates ay naka-log para sa audit trail."
  }
  
  if (lowerQuestion.includes("bagong") && lowerQuestion.includes("rehistrado") || (lowerQuestion.includes("new") && lowerQuestion.includes("registered"))) {
    return "Ngayong buwan, may 15 bagong residents na nag-register sa portal. Breakdown: 8 mula sa Purok 1, 4 mula sa Purok 2, at 3 mula sa Purok 3. Pumunta sa Residents > New Registrations para makita ang complete list."
  }
  
  if (lowerQuestion.includes("senior") && lowerQuestion.includes("citizen")) {
    return "Sa kasalukuyan, may 287 registered senior citizens sa Barangay Santiago. Para makita ang complete list at records, pumunta sa Residents section at i-filter by 'Senior Citizen'. Dito makikita rin ang kanilang OSCA ID status at benefits received."
  }
  
  if (lowerQuestion.includes("voter") || lowerQuestion.includes("registered voters")) {
    return "May 3,245 registered voters sa Barangay Santiago base sa latest COMELEC data. Para sa complete voter records at precinct assignments, pumunta sa Residents > Voter Records."
  }

  if (lowerQuestion.includes("approval") || lowerQuestion.includes("for approval")) {
    return "May 24 requests na naghihintay ng inyong approval: 12 Barangay Clearance (priority), 8 Certificate of Residency, at 4 Certificate of Indigency. May 3 urgent requests na marked as 'Rush'. Pumunta sa Documents > For Approval."
  }
  
  if (lowerQuestion.includes("rejected") || lowerQuestion.includes("declined")) {
    return "Ngayong linggo, may 8 rejected applications: 5 dahil sa incomplete requirements, 2 dahil sa invalid ID, at 1 dahil sa unverified residency. Pumunta sa Documents > Rejected para i-review at i-notify ang mga applicants."
  }
  
  if (lowerQuestion.includes("urgent") && lowerQuestion.includes("request")) {
    return "May 5 urgent requests ngayon: 2 Barangay Clearance (for employment), 2 Certificate of Indigency (for hospital), at 1 Certificate of Residency (for school enrollment). Ito ay dapat ma-process within 24 hours."
  }
  
  if (lowerQuestion.includes("print") && lowerQuestion.includes("summary")) {
    return "Para i-print ang transaction summary, pumunta sa Documents > Transaction History. Piliin ang date range at i-click ang 'Print Summary' button. Maaari ring i-export sa PDF o Excel format para sa record keeping."
  }

  if (lowerQuestion.includes("blotter") && (lowerQuestion.includes("latest") || lowerQuestion.includes("recent") || lowerQuestion.includes("ipakita"))) {
    return "Narito ang 5 latest blotter reports: (1) Noise Complaint - Purok 3 (Filed), (2) Property Dispute - Purok 2 (Processing), (3) Physical Altercation - Purok 1 (For Mediation), (4) Theft Report - Purok 4 (Under Investigation), (5) Neighbor Dispute - Purok 2 (Scheduled for Hearing). Pumunta sa Blotters section para sa details."
  }
  
  if (lowerQuestion.includes("unresolved") || lowerQuestion.includes("pending") && lowerQuestion.includes("case")) {
    return "May 12 unresolved blotter cases: 4 Property Disputes, 3 Noise Complaints, 3 Neighborhood Disputes, at 2 Domestic Issues. 3 cases ang scheduled for mediation next week. Pumunta sa Blotters > Pending Cases para sa action items."
  }
  
  if (lowerQuestion.includes("peace") && lowerQuestion.includes("order") || lowerQuestion.includes("crime") && lowerQuestion.includes("statistics")) {
    return "Peace and Order Report ngayong buwan: 28 total incidents reported, 18 resolved (64% resolution rate). Breakdown: Noise Complaints (10), Property Disputes (8), Neighborhood Disputes (6), Others (4). May 2 cases na na-escalate sa police."
  }
  
  if (lowerQuestion.includes("tanod") || lowerQuestion.includes("alert")) {
    return "Para mag-send ng alert sa barangay tanods, pumunta sa Blotters section at piliin ang case. I-click ang 'Send Alert' button at piliin ang tanod on duty. Maaari ring mag-send ng group alert para sa emergency situations."
  }

  if (lowerQuestion.includes("post") && lowerQuestion.includes("announcement") || lowerQuestion.includes("mag-post")) {
    return "Para mag-post ng bagong announcement, pumunta sa Announcements section at i-click ang 'New Announcement'. Ilagay ang title, content, at category. Maaaring i-schedule ang posting o i-publish agad. Maaari ring mag-attach ng images at set ang expiration date."
  }
  
  if (lowerQuestion.includes("sms") || lowerQuestion.includes("notify") || lowerQuestion.includes("notification")) {
    return "Para mag-send ng SMS notification sa residents, pumunta sa Announcements > SMS Broadcast. Piliin ang target audience (All, Specific Purok, o Selected Residents), i-compose ang message (max 160 characters), at i-send. May SMS history log para sa record."
  }
  
  if (lowerQuestion.includes("emergency") && lowerQuestion.includes("advisory")) {
    return "Para sa emergency advisory, pumunta sa Announcements > Emergency Broadcast. Ito ay automatic na ma-se-send sa lahat ng registered residents via SMS at portal notification. I-fill up ang nature of emergency, instructions, at contact numbers."
  }

  if (lowerQuestion.includes("summarize") || lowerQuestion.includes("summary") && lowerQuestion.includes("today")) {
    return "Summary ngayong araw: 15 documents processed, 5 new blotter reports, 2 cases resolved, 3 new resident registrations. Top activities: Document processing (60%), Blotter handling (25%), Resident inquiries (15%). Total staff online: 4."
  }
  
  if (lowerQuestion.includes("performance") || lowerQuestion.includes("analytics")) {
    return "Service Performance ngayong buwan: Average processing time - 2.3 days (target: 3 days), Approval rate - 89%, Resident satisfaction - 4.5/5. Busiest days: Monday at Friday. Peak hours: 9-11 AM at 2-4 PM."
  }
  
  if (lowerQuestion.includes("predict") || lowerQuestion.includes("peak") && lowerQuestion.includes("hours")) {
    return "Base sa historical data, ang predicted peak hours ngayong linggo ay: Monday 9-11 AM (document requests), Wednesday 2-4 PM (blotter filings), Friday 9 AM-12 PM (clearances for employment). I-recommend ang additional staff during these times."
  }

  if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi") || lowerQuestion.includes("magandang")) {
    return "Magandang araw! Ako ang AI Assistant para sa Barangay Santiago Admin Portal. Paano ko kayo matutulungan ngayon? Maaari akong mag-provide ng reports, statistics, at tulong sa document processing, blotter monitoring, at iba pa."
  }
  
  if (lowerQuestion.includes("salamat") || lowerQuestion.includes("thank")) {
    return "Walang anuman! Narito lang ako para tumulong sa inyong administrative tasks. May iba pa ba kayong kailangan? Maaari akong tumulong sa reports, resident records, document processing, at marami pa."
  }

  return "Pasensya na, hindi ko masyadong naintindihan ang inyong tanong. Maaari ba ninyong i-rephrase o pumili sa mga sumusunod: Pending Requests, Monthly Reports, Resident Search, Blotter Monitoring, Announcements, o System Analytics? Narito ako para tumulong sa inyong administrative tasks."
}

export function OfficialChatbot() {
  return (
    <AIChatbot
      portalType="official"
      suggestedQuestions={officialSuggestedQuestions}
      getResponse={getOfficialResponse}
      welcomeMessage="Magandang araw! Ako ang AI Assistant para sa Barangay Santiago Admin Portal. Paano ko kayo matutulungan ngayon? Maaari akong mag-generate ng reports, magbigay ng statistics, at tumulong sa inyong administrative tasks."
      title="AI Assistant"
      subtitle="Barangay Santiago Admin Portal"
      accentColor="emerald"
    />
  )
}
