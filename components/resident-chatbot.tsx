"use client"

import { AIChatbot } from "./ai-chatbot"

const residentSuggestedQuestions = [
  { text: "Paano kumuha ng Barangay Clearance?", category: "documents" },
  { text: "Ano ang requirements para sa clearance?", category: "documents" },
  { text: "Paano mag-file ng blotter report?", category: "blotter" },
  { text: "Anong oras bukas ang barangay?", category: "general" },
  { text: "Paano kumuha ng Certificate of Residency?", category: "documents" },
  { text: "Sino ang Barangay Captain?", category: "general" },
  { text: "Pwede bang online ang pag-request ng dokumento?", category: "documents" },
  { text: "Magkano ang bayad sa clearance?", category: "documents" },
]

function getResidentResponse(question: string): string {
  const lowerQuestion = question.toLowerCase()
  
  // Barangay Clearance
  if (lowerQuestion.includes("clearance") && (lowerQuestion.includes("kumuha") || lowerQuestion.includes("paano") || lowerQuestion.includes("request"))) {
    return "Para kumuha ng Barangay Clearance, mag-login ka sa portal at pumunta sa Documents section. I-click ang 'Request Document', piliin ang Barangay Clearance, at i-upload ang kinakailangang valid ID. Awtomatikong mapoproseso ang iyong request at makakatanggap ka ng notification kapag ready na."
  }
  
  if (lowerQuestion.includes("clearance") && lowerQuestion.includes("requirement")) {
    return "Ang mga requirements para sa Barangay Clearance ay: (1) Valid ID tulad ng National ID, Driver's License, o Passport, (2) Proof of Residency kung bago sa barangay, at (3) Filled-out application form na available sa portal. Magdala din ng 2x2 ID picture kung personal na pupunta sa office."
  }
  
  if ((lowerQuestion.includes("magkano") || lowerQuestion.includes("bayad") || lowerQuestion.includes("fee")) && lowerQuestion.includes("clearance")) {
    return "Ang Barangay Clearance ay may processing fee na Php 50.00 lamang. Maaaring magbayad online sa portal o direkta sa barangay office. Kung may discount para sa senior citizens at PWDs, may 20% discount na ibinibigay."
  }
  
  if (lowerQuestion.includes("clearance") && (lowerQuestion.includes("track") || lowerQuestion.includes("status") || lowerQuestion.includes("ready"))) {
    return "Maaari mong i-track ang status ng iyong Barangay Clearance sa Documents section ng portal. Makikita mo doon kung 'Pending', 'Processing', o 'Ready for Pickup' na ang iyong request. Makakatanggap ka rin ng notification sa email at sa portal kapag ready na."
  }

  // Certificate of Residency
  if (lowerQuestion.includes("residency") || lowerQuestion.includes("certificate of residency")) {
    return "Para kumuha ng Certificate of Residency, kailangan mong mag-submit ng valid ID at proof na naninirahan ka sa barangay (tulad ng utility bill o rental contract). Pumunta sa Documents section ng portal at piliin ang Certificate of Residency. Karaniwan itong na-aapprove within 1-2 working days."
  }

  // Certificate of Indigency
  if (lowerQuestion.includes("indigency") || lowerQuestion.includes("certificate of indigency")) {
    return "Ang Certificate of Indigency ay para sa mga residenteng nangangailangan ng financial assistance para sa medical, educational, o iba pang purposes. Kailangan mong mag-submit ng valid ID at statement of purpose. Pumunta sa barangay office para sa assessment o mag-apply online sa portal."
  }

  // Blotter Report
  if (lowerQuestion.includes("blotter") && (lowerQuestion.includes("file") || lowerQuestion.includes("paano") || lowerQuestion.includes("mag-file") || lowerQuestion.includes("report"))) {
    return "Para mag-file ng blotter report, pumunta sa Blotter section ng portal at i-click ang 'File Report'. Piliin ang uri ng insidente, ilagay ang petsa at lokasyon, at idetalye ang nangyari. Maaari ka ring mag-upload ng ebidensya tulad ng larawan. Ang iyong report ay titingnan ng barangay officials at makakakuha ka ng reference number."
  }
  
  if (lowerQuestion.includes("blotter") && (lowerQuestion.includes("confidential") || lowerQuestion.includes("private"))) {
    return "Oo, ang lahat ng blotter reports ay strictly confidential. Tanging mga authorized barangay officials lang ang may access sa mga ito. Hindi ibabahagi ang iyong personal na impormasyon sa respondent o sa public maliban kung kinakailangan ng legal proceedings."
  }
  
  if (lowerQuestion.includes("blotter") && (lowerQuestion.includes("upload") || lowerQuestion.includes("ebidensya") || lowerQuestion.includes("evidence") || lowerQuestion.includes("photo"))) {
    return "Oo, maaari kang mag-upload ng mga ebidensya tulad ng larawan, video, o dokumento kasama ng iyong blotter report. Ito ay makakatulong sa mabilis na resolution ng iyong kaso. Ang mga files ay secure at confidential."
  }

  // Business Permit
  if (lowerQuestion.includes("business") && (lowerQuestion.includes("permit") || lowerQuestion.includes("clearance"))) {
    return "Para sa Business Clearance o Permit, kailangan mong mag-submit ng DTI Registration, Mayor's Permit application, at valid ID ng business owner. Pumunta sa Business section ng portal o direkta sa barangay office. Ang processing time ay 3-5 working days."
  }

  // General Questions
  if (lowerQuestion.includes("oras") || lowerQuestion.includes("bukas") || lowerQuestion.includes("office hours")) {
    return "Ang Barangay Santiago office ay bukas mula Lunes hanggang Biyernes, 8:00 AM hanggang 5:00 PM. Sarado tuwing Sabado at Linggo maliban kung may emergency. Para sa urgent concerns, maaaring tumawag sa emergency hotline na 0917-XXX-XXXX."
  }
  
  if (lowerQuestion.includes("captain") || lowerQuestion.includes("sino ang barangay")) {
    return "Ang kasalukuyang Punong Barangay ng Barangay Santiago ay si Kap. Rolando C. Borja. Siya ay maaaring kausapin sa office hours o mag-schedule ng appointment sa portal para sa mga importanteng usapan."
  }
  
  if (lowerQuestion.includes("contact") || lowerQuestion.includes("number") || lowerQuestion.includes("makipag-ugnayan")) {
    return "Maaari kayong makipag-ugnayan sa Barangay Santiago sa pamamagitan ng: Telepono: (047) XXX-XXXX, Email: barangaysantiago@sanantonio.gov.ph, o bisitahin ang office sa Barangay Santiago, San Antonio, Zambales. Para sa emergency, tumawag sa 0917-XXX-XXXX."
  }
  
  if (lowerQuestion.includes("lokasyon") || lowerQuestion.includes("saan") || lowerQuestion.includes("location") || lowerQuestion.includes("address")) {
    return "Ang Barangay Santiago ay matatagpuan sa Municipality of San Antonio, Province of Zambales. Ang barangay hall ay nasa gitna ng barangay, malapit sa Santiago Chapel at public plaza."
  }

  // Online Services
  if (lowerQuestion.includes("online") && (lowerQuestion.includes("request") || lowerQuestion.includes("available") || lowerQuestion.includes("serbisyo"))) {
    return "Oo, maraming serbisyo ang available online sa Barangay Santiago Resident Portal! Maaari kang mag-request ng Barangay Clearance, Certificate of Residency, Certificate of Indigency, at mag-file ng blotter reports online. I-track din ang status ng iyong mga requests anytime."
  }

  // Appointment
  if (lowerQuestion.includes("appointment") || lowerQuestion.includes("schedule") || lowerQuestion.includes("book")) {
    return "Maaari kang mag-book ng appointment sa barangay office sa pamamagitan ng portal. Pumunta sa Profile section at piliin ang 'Schedule Appointment'. Piliin ang available na slot at ang purpose ng iyong visit. Makakatanggap ka ng confirmation via email."
  }

  // Announcements
  if (lowerQuestion.includes("announcement") || lowerQuestion.includes("balita") || lowerQuestion.includes("event")) {
    return "Maaari mong makita ang lahat ng announcements at events ng barangay sa Announcements section ng portal. Kasama dito ang mga advisories, scheduled activities, health programs, at iba pang importanteng balita para sa mga residente."
  }

  // Projects
  if (lowerQuestion.includes("project") || lowerQuestion.includes("programa")) {
    return "Ang lahat ng ongoing at completed projects ng barangay ay makikita sa Projects section ng portal. Dito makikita ang mga infrastructure projects, livelihood programs, health initiatives, at iba pang community development programs."
  }

  // Ordinances
  if (lowerQuestion.includes("ordinance") || lowerQuestion.includes("batas") || lowerQuestion.includes("rules")) {
    return "Ang mga barangay ordinances ay makikita sa Ordinances section ng portal. Dito kasama ang mga local regulations, curfew rules, noise ordinance, at iba pang policies na ipinapatupad sa Barangay Santiago."
  }

  // Thank you / Greeting
  if (lowerQuestion.includes("salamat") || lowerQuestion.includes("thank")) {
    return "Walang anuman! Narito lang ako para tumulong sa inyong mga katanungan tungkol sa mga serbisyo ng Barangay Santiago. May iba pa ba akong maitutulong?"
  }
  
  if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi") || lowerQuestion.includes("magandang")) {
    return "Magandang araw! Ako ang AI Assistant ng Barangay Santiago Resident Portal. Paano kita matutulungan ngayon? Maaari akong sumagot ng mga tanong tungkol sa documents, blotter reports, barangay services, at marami pa."
  }

  // Default response
  return "Pasensya na, hindi ko masyadong naintindihan ang iyong tanong. Maaari mo bang i-rephrase o pumili sa mga sumusunod na topics: Barangay Clearance, Certificate of Residency, Blotter Reports, Business Permits, Office Hours, o Online Services? Narito ako para tumulong!"
}

export function ResidentChatbot() {
  return (
    <AIChatbot
      portalType="resident"
      suggestedQuestions={residentSuggestedQuestions}
      getResponse={getResidentResponse}
      welcomeMessage="Magandang araw! Ako ang AI Assistant ng Barangay Santiago. Paano kita matutulungan ngayon? Maaari akong sumagot ng mga tanong tungkol sa mga serbisyo ng barangay, pagkuha ng documents, at marami pa."
      title="AI Assistant"
      subtitle="Barangay Santiago Resident Portal"
      accentColor="emerald"
    />
  )
}
