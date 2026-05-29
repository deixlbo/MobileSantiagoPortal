import { DocumentType } from '@/lib/database'

export interface DocumentData {
  residentName: string
  address: string
  controlNumber: string
  issuedDate: Date
  barangayCaptan: string
  orNumber?: string
  purpose?: string
  respondentName?: string
  natureOfCase?: string
  dateOfIncident?: Date
  businessName?: string
  businessOwner?: string
}

// Document templates
const documentTemplates: Record<DocumentType, (data: DocumentData) => string> = {
  barangay_clearance: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 8.5in; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 16px; font-weight: bold; margin: 10px 0; }
    .content { text-align: justify; margin: 30px 0; }
    .signature { margin-top: 50px; }
    .footer { margin-top: 20px; font-size: 12px; }
    .control-number { font-size: 11px; margin-top: 30px; }
    b { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <p style="margin: 0; font-size: 12px;">Republic of the Philippines</p>
    <p style="margin: 0; font-size: 12px;">Province of Zambales</p>
    <p style="margin: 0; font-size: 12px;">Municipality of San Antonio</p>
    <p style="margin: 0; font-size: 12px;">Barangay Santiago</p>
    <p style="margin: 0; font-size: 12px; margin-top: 10px;">OFFICE OF THE BARANGAY CAPTAIN</p>
    <p class="title">BARANGAY CLEARANCE</p>
  </div>
  
  <p style="margin-bottom: 20px;">TO WHOM IT MAY CONCERN:</p>
  
  <div class="content">
    <p>This is to certify that <b>${data.residentName}</b>, of legal age, a resident of <u>${data.address}</u>, Barangay Santiago, San Antonio, Zambales, is of good moral character and has no derogatory record on file in this barangay.</p>
    <p>Issued upon request for whatever legal purpose it may serve.</p>
  </div>
  
  <p>Issued this _____ day of __________, 20____.</p>
  
  <div class="signature">
    <p style="margin-top: 60px;">________________________________</p>
    <p>${data.barangayCaptan}</p>
    <p>Barangay Captain</p>
  </div>
  
  <div class="footer">
    <p style="margin: 5px 0;">O.R. No.: ${data.orNumber || '____________________'}</p>
    <p style="margin: 5px 0;">Date Issued: ${data.issuedDate.toLocaleDateString()}</p>
    <p style="margin: 5px 0;">Doc. Stamp: Paid</p>
  </div>
  
  <div class="control-number">
    <p>Control Number: ${data.controlNumber}</p>
  </div>
</body>
</html>
  `,

  certificate_of_residency: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 8.5in; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 16px; font-weight: bold; margin: 10px 0; }
    .content { text-align: justify; margin: 30px 0; }
    .signature { margin-top: 50px; }
    .footer { margin-top: 20px; font-size: 12px; }
    b { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <p style="margin: 0; font-size: 12px;">Republic of the Philippines</p>
    <p style="margin: 0; font-size: 12px;">Province of Zambales</p>
    <p style="margin: 0; font-size: 12px;">Municipality of San Antonio</p>
    <p style="margin: 0; font-size: 12px;">Barangay Santiago</p>
    <p style="margin: 0; font-size: 12px; margin-top: 10px;">OFFICE OF THE BARANGAY CAPTAIN</p>
    <p class="title">CERTIFICATE OF RESIDENCY</p>
  </div>
  
  <p style="margin-bottom: 20px;">TO WHOM IT MAY CONCERN:</p>
  
  <div class="content">
    <p>This is to certify that <b>${data.residentName}</b> is a bonafide resident of Barangay Santiago, San Antonio, Zambales.</p>
    <p>Issued upon request for ${data.purpose || '____________________________'}.</p>
  </div>
  
  <p>Issued this _____ day of __________, 20____.</p>
  
  <div class="signature">
    <p style="margin-top: 60px;">________________________________</p>
    <p>${data.barangayCaptan}</p>
    <p>Barangay Captain</p>
  </div>
  
  <div class="footer">
    <p style="margin: 5px 0;">O.R. No.: ${data.orNumber || '____________________'}</p>
    <p style="margin: 5px 0;">Date Issued: ${data.issuedDate.toLocaleDateString()}</p>
    <p style="margin: 5px 0;">Doc. Stamp: Paid</p>
  </div>
</body>
</html>
  `,

  certificate_of_indigency: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 8.5in; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 16px; font-weight: bold; margin: 10px 0; }
    .content { text-align: justify; margin: 30px 0; }
    .signature { margin-top: 50px; }
    .footer { margin-top: 20px; font-size: 12px; }
    b { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <p style="margin: 0; font-size: 12px;">Republic of the Philippines</p>
    <p style="margin: 0; font-size: 12px;">Province of Zambales</p>
    <p style="margin: 0; font-size: 12px;">Municipality of San Antonio</p>
    <p style="margin: 0; font-size: 12px;">Barangay Santiago</p>
    <p style="margin: 0; font-size: 12px; margin-top: 10px;">OFFICE OF THE BARANGAY CAPTAIN</p>
    <p class="title">CERTIFICATE OF INDIGENCY</p>
  </div>
  
  <p style="margin-bottom: 20px;">TO WHOM IT MAY CONCERN:</p>
  
  <div class="content">
    <p>This is to certify that <b>${data.residentName}</b> is a resident of Barangay Santiago and belongs to an indigent family.</p>
    <p>Issued upon request for ${data.purpose || '____________________________'}.</p>
  </div>
  
  <p>Issued this _____ day of __________, 20____.</p>
  
  <div class="signature">
    <p style="margin-top: 60px;">________________________________</p>
    <p>${data.barangayCaptan}</p>
    <p>Barangay Captain</p>
  </div>
  
  <div class="footer">
    <p style="margin: 5px 0;">O.R. No.: ${data.orNumber || '____________________'}</p>
    <p style="margin: 5px 0;">Date Issued: ${data.issuedDate.toLocaleDateString()}</p>
    <p style="margin: 5px 0;">Doc. Stamp: Paid</p>
  </div>
</body>
</html>
  `,

  certificate_of_solo_parent: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 8.5in; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 16px; font-weight: bold; margin: 10px 0; }
    .content { text-align: justify; margin: 30px 0; }
    .signature { margin-top: 50px; }
    .footer { margin-top: 20px; font-size: 12px; }
    b { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <p style="margin: 0; font-size: 12px;">Republic of the Philippines</p>
    <p style="margin: 0; font-size: 12px;">Province of Zambales</p>
    <p style="margin: 0; font-size: 12px;">Municipality of San Antonio</p>
    <p style="margin: 0; font-size: 12px;">Barangay Santiago</p>
    <p style="margin: 0; font-size: 12px; margin-top: 10px;">OFFICE OF THE BARANGAY CAPTAIN</p>
    <p class="title">CERTIFICATE OF SOLO PARENT</p>
  </div>
  
  <p style="margin-bottom: 20px;">TO WHOM IT MAY CONCERN:</p>
  
  <div class="content">
    <p>This is to certify that <b>${data.residentName}</b> is a solo parent and a resident of Barangay Santiago, San Antonio, Zambales.</p>
    <p>Issued upon request for ${data.purpose || '____________________________'}.</p>
  </div>
  
  <p>Issued this _____ day of __________, 20____.</p>
  
  <div class="signature">
    <p style="margin-top: 60px;">________________________________</p>
    <p>${data.barangayCaptan}</p>
    <p>Barangay Captain</p>
  </div>
  
  <div class="footer">
    <p style="margin: 5px 0;">O.R. No.: ${data.orNumber || '____________________'}</p>
    <p style="margin: 5px 0;">Date Issued: ${data.issuedDate.toLocaleDateString()}</p>
    <p style="margin: 5px 0;">Doc. Stamp: Paid</p>
  </div>
</body>
</html>
  `,

  barangay_business_clearance: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 8.5in; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 16px; font-weight: bold; margin: 10px 0; }
    .content { text-align: justify; margin: 30px 0; }
    .signature { margin-top: 50px; }
    .footer { margin-top: 20px; font-size: 12px; }
    b { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <p style="margin: 0; font-size: 12px;">Republic of the Philippines</p>
    <p style="margin: 0; font-size: 12px;">Province of Zambales</p>
    <p style="margin: 0; font-size: 12px;">Municipality of San Antonio</p>
    <p style="margin: 0; font-size: 12px;">Barangay Santiago</p>
    <p style="margin: 0; font-size: 12px; margin-top: 10px;">OFFICE OF THE BARANGAY CAPTAIN</p>
    <p class="title">BARANGAY BUSINESS CLEARANCE</p>
  </div>
  
  <p style="margin-bottom: 20px;">TO WHOM IT MAY CONCERN:</p>
  
  <div class="content">
    <p>This is to certify that <b>${data.businessOwner}</b>, owner of <b>${data.businessName}</b>, located at Barangay Santiago, has complied with barangay requirements.</p>
    <p>Issued in support of business permit application.</p>
  </div>
  
  <p>Issued this _____ day of __________, 20____.</p>
  
  <div class="signature">
    <p style="margin-top: 60px;">________________________________</p>
    <p>${data.barangayCaptan}</p>
    <p>Barangay Captain</p>
  </div>
  
  <div class="footer">
    <p style="margin: 5px 0;">O.R. No.: ${data.orNumber || '____________________'}</p>
    <p style="margin: 5px 0;">Date Issued: ${data.issuedDate.toLocaleDateString()}</p>
    <p style="margin: 5px 0;">Doc. Stamp: Paid</p>
  </div>
</body>
</html>
  `,

  certificate_of_business_closure: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 8.5in; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 16px; font-weight: bold; margin: 10px 0; }
    .content { text-align: justify; margin: 30px 0; }
    .signature { margin-top: 50px; }
    .footer { margin-top: 20px; font-size: 12px; }
    b { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <p style="margin: 0; font-size: 12px;">Republic of the Philippines</p>
    <p style="margin: 0; font-size: 12px;">Province of Zambales</p>
    <p style="margin: 0; font-size: 12px;">Municipality of San Antonio</p>
    <p style="margin: 0; font-size: 12px;">Barangay Santiago</p>
    <p style="margin: 0; font-size: 12px; margin-top: 10px;">OFFICE OF THE BARANGAY CAPTAIN</p>
    <p class="title">CERTIFICATE OF BUSINESS CLOSURE</p>
  </div>
  
  <p style="margin-bottom: 20px;">TO WHOM IT MAY CONCERN:</p>
  
  <div class="content">
    <p>This is to certify that the business owned by <b>${data.businessOwner}</b> named <b>${data.businessName}</b> has ceased operations in Barangay Santiago.</p>
    <p>Issued upon request for record purposes.</p>
  </div>
  
  <p>Issued this _____ day of __________, 20____.</p>
  
  <div class="signature">
    <p style="margin-top: 60px;">________________________________</p>
    <p>${data.barangayCaptan}</p>
    <p>Barangay Captain</p>
  </div>
  
  <div class="footer">
    <p style="margin: 5px 0;">O.R. No.: ${data.orNumber || '____________________'}</p>
    <p style="margin: 5px 0;">Date Issued: ${data.issuedDate.toLocaleDateString()}</p>
    <p style="margin: 5px 0;">Doc. Stamp: Paid</p>
  </div>
</body>
</html>
  `,

  certificate_to_file_action: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 8.5in; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 16px; font-weight: bold; margin: 10px 0; }
    .content { text-align: justify; margin: 30px 0; }
    .signature { margin-top: 50px; }
    .footer { margin-top: 20px; font-size: 12px; }
    b { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <p style="margin: 0; font-size: 12px;">Republic of the Philippines</p>
    <p style="margin: 0; font-size: 12px;">Province of Zambales</p>
    <p style="margin: 0; font-size: 12px;">Municipality of San Antonio</p>
    <p style="margin: 0; font-size: 12px;">Barangay Santiago</p>
    <p style="margin: 0; font-size: 12px; margin-top: 10px;">OFFICE OF THE BARANGAY CAPTAIN</p>
    <p class="title">CERTIFICATE TO FILE ACTION</p>
  </div>
  
  <p style="margin-bottom: 20px;">TO WHOM IT MAY CONCERN:</p>
  
  <div class="content">
    <p>This is to certify that a complaint filed by <b>${data.residentName}</b> against <b>${data.respondentName}</b> was brought before this Barangay for mediation.</p>
    <p>Efforts for amicable settlement have failed; therefore, this certification is issued to allow filing of appropriate action in court.</p>
  </div>
  
  <p>Issued this _____ day of __________, 20____.</p>
  
  <div class="signature">
    <p style="margin-top: 60px;">________________________________</p>
    <p>${data.barangayCaptan}</p>
    <p>Barangay Captain</p>
  </div>
  
  <div class="footer">
    <p style="margin: 5px 0;">Control Number: ${data.controlNumber}</p>
  </div>
</body>
</html>
  `,

  medical_assistance_certificate: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 8.5in; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 16px; font-weight: bold; margin: 10px 0; }
    .content { text-align: justify; margin: 30px 0; }
    .signature { margin-top: 50px; }
    .footer { margin-top: 20px; font-size: 12px; }
    b { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <p style="margin: 0; font-size: 12px;">Republic of the Philippines</p>
    <p style="margin: 0; font-size: 12px;">Province of Zambales</p>
    <p style="margin: 0; font-size: 12px;">Municipality of San Antonio</p>
    <p style="margin: 0; font-size: 12px;">Barangay Santiago</p>
    <p style="margin: 0; font-size: 12px; margin-top: 10px;">OFFICE OF THE BARANGAY CAPTAIN</p>
    <p class="title">MEDICAL ASSISTANCE CERTIFICATE</p>
  </div>
  
  <p style="margin-bottom: 20px;">TO WHOM IT MAY CONCERN:</p>
  
  <div class="content">
    <p>This is to certify that <b>${data.residentName}</b> is a resident of Barangay Santiago and is requesting medical assistance due to financial constraints.</p>
    <p>Issued upon request for assistance purposes.</p>
  </div>
  
  <p>Issued this _____ day of __________, 20____.</p>
  
  <div class="signature">
    <p style="margin-top: 60px;">________________________________</p>
    <p>${data.barangayCaptan}</p>
    <p>Barangay Captain</p>
  </div>
  
  <div class="footer">
    <p style="margin: 5px 0;">Control Number: ${data.controlNumber}</p>
  </div>
</body>
</html>
  `,

  blotter_report: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 8.5in; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 16px; font-weight: bold; margin: 10px 0; }
    .content { text-align: justify; margin: 30px 0; }
    .signature { margin-top: 50px; }
    .footer { margin-top: 20px; font-size: 12px; }
    b { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <p style="margin: 0; font-size: 12px;">Republic of the Philippines</p>
    <p style="margin: 0; font-size: 12px;">Province of Zambales</p>
    <p style="margin: 0; font-size: 12px;">Municipality of San Antonio</p>
    <p style="margin: 0; font-size: 12px;">Barangay Santiago</p>
    <p style="margin: 0; font-size: 12px; margin-top: 10px;">OFFICE OF THE BARANGAY CAPTAIN</p>
    <p class="title">BARANGAY BLOTTER REPORT</p>
  </div>
  
  <p style="margin-bottom: 20px;">TO WHOM IT MAY CONCERN:</p>
  
  <div class="content">
    <p>This is to certify that a complaint/incident was recorded in the Barangay Blotter involving:</p>
    <p><b>Complainant:</b> ${data.complainantName}</p>
    <p><b>Respondent:</b> ${data.respondentName}</p>
    <p><b>Nature of Case:</b> ${data.natureOfCase}</p>
    <p><b>Date of Incident:</b> ${data.dateOfIncident?.toLocaleDateString() || '____________________'}</p>
    <p>This certification is issued upon request for legal purposes.</p>
  </div>
  
  <p>Issued this _____ day of __________, 20____.</p>
  
  <div class="signature">
    <p style="margin-top: 60px;">________________________________</p>
    <p>${data.barangayCaptan}</p>
    <p>Barangay Captain</p>
  </div>
</body>
</html>
  `,

  settlement_agreement: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 8.5in; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .title { font-size: 16px; font-weight: bold; margin: 10px 0; }
    .content { text-align: justify; margin: 30px 0; }
    .signature { margin-top: 50px; }
    .footer { margin-top: 20px; font-size: 12px; }
    b { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="header">
    <p style="margin: 0; font-size: 12px;">Republic of the Philippines</p>
    <p style="margin: 0; font-size: 12px;">Province of Zambales</p>
    <p style="margin: 0; font-size: 12px;">Municipality of San Antonio</p>
    <p style="margin: 0; font-size: 12px;">Barangay Santiago</p>
    <p style="margin: 0; font-size: 12px; margin-top: 10px;">OFFICE OF THE BARANGAY CAPTAIN</p>
    <p class="title">SETTLEMENT AGREEMENT</p>
  </div>
  
  <div class="content">
    <p>We, <b>${data.residentName}</b> and <b>${data.respondentName}</b>, both residents of Barangay Santiago, agree to settle our dispute under the following terms:</p>
    <p style="border: 1px solid #000; padding: 20px; min-height: 60px;">________________________________________________________</p>
    <p>Both parties agree to abide by this settlement.</p>
  </div>
  
  <p>Signed this _____ day of __________, 20____.</p>
  
  <div class="signature">
    <p style="margin-top: 60px;">__________________________        __________________________</p>
    <p>Complainant                        Respondent</p>
    <p style="margin-top: 60px;">________________________________</p>
    <p>${data.barangayCaptan}</p>
    <p>Barangay Captain</p>
  </div>
</body>
</html>
  `,
}

// Generate document HTML
export function generateDocumentHTML(documentType: DocumentType, data: DocumentData): string {
  const template = documentTemplates[documentType]
  if (!template) {
    throw new Error(`Unknown document type: ${documentType}`)
  }
  return template(data)
}

// Generate control number
export function generateControlNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(5, '0')
  return `${year}-${random}`
}
