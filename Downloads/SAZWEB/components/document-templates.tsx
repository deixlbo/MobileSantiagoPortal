"use client"

import { forwardRef } from "react"
import { format } from "date-fns"
import type { DocumentRequest, Resident, BlotterReport } from "@/lib/mock-data"

interface DocumentTemplateProps {
  request: DocumentRequest
  resident?: Resident
  captain?: string
}

// Barangay Header Component
const BarangayHeader = () => (
  <div className="text-center mb-8">
    <p className="text-sm">Republic of the Philippines</p>
    <p className="text-sm">Province of Zambales</p>
    <p className="text-sm">Municipality of San Antonio</p>
    <p className="text-sm font-semibold">BARANGAY SANTIAGO</p>
    <div className="mt-4 mb-2">
      <div className="w-20 h-20 mx-auto border-2 border-gray-400 rounded-full flex items-center justify-center text-xs text-gray-400">
        Barangay Seal
      </div>
    </div>
    <p className="text-sm font-semibold mt-2">OFFICE OF THE PUNONG BARANGAY</p>
  </div>
)

// Signature Section
const SignatureSection = ({ captain }: { captain: string }) => (
  <div className="mt-12 text-right">
    <div className="inline-block text-center">
      <div className="border-b border-black w-48 mb-1" />
      <p className="font-semibold">{captain}</p>
      <p className="text-sm">Punong Barangay</p>
    </div>
  </div>
)

// Document Footer
const DocumentFooter = ({ request }: { request: DocumentRequest }) => (
  <div className="mt-8 pt-4 border-t border-gray-300 text-sm">
    <div className="flex justify-between">
      <div>
        <p><span className="font-medium">Control No.:</span> {request.controlNumber || '_______________'}</p>
        <p><span className="font-medium">O.R. No.:</span> {request.orNumber || '_______________'}</p>
      </div>
      <div className="text-right">
        <p><span className="font-medium">Date Issued:</span> {request.approvedAt ? format(new Date(request.approvedAt), 'MMMM d, yyyy') : '_______________'}</p>
        <p><span className="font-medium">Doc. Stamp:</span> Paid</p>
      </div>
    </div>
  </div>
)

// Barangay Clearance Template
export const BarangayClearanceTemplate = forwardRef<HTMLDivElement, DocumentTemplateProps>(
  ({ request, resident, captain = "Hon. Roberto S. Dela Cruz" }, ref) => {
    const residentData = resident || {
      fullName: request.residentName,
      age: '____',
      address: request.address,
    }

    return (
      <div ref={ref} className="print-document bg-white p-8 max-w-2xl mx-auto font-serif text-black" style={{ minHeight: '11in' }}>
        <BarangayHeader />
        
        <h2 className="text-xl font-bold text-center mb-8 underline">BARANGAY CLEARANCE</h2>
        
        <p className="mb-6 font-semibold">TO WHOM IT MAY CONCERN:</p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          This is to certify that <span className="font-bold underline">{residentData.fullName}</span>, 
          <span className="font-bold"> {typeof residentData.age === 'number' ? residentData.age : '____'} </span> years old, 
          a resident of <span className="font-bold">{residentData.address || 'Barangay Santiago, San Antonio, Zambales'}</span>, 
          is known to be of good moral character and a law-abiding citizen in this community.
        </p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          He/She has no derogatory and/or criminal records filed in this barangay.
        </p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          This certification is issued upon request for <span className="font-bold underline">{request.purpose}</span> purposes.
        </p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          ISSUED this <span className="font-bold">{request.approvedAt ? format(new Date(request.approvedAt), 'do') : '____'}</span> day 
          of <span className="font-bold">{request.approvedAt ? format(new Date(request.approvedAt), 'MMMM, yyyy') : '____________, 20__'}</span> at 
          Barangay Santiago, San Antonio, Zambales.
        </p>
        
        <SignatureSection captain={captain} />
        <DocumentFooter request={request} />
      </div>
    )
  }
)
BarangayClearanceTemplate.displayName = 'BarangayClearanceTemplate'

// Certificate of Residency Template
export const CertificateOfResidencyTemplate = forwardRef<HTMLDivElement, DocumentTemplateProps>(
  ({ request, resident, captain = "Hon. Roberto S. Dela Cruz" }, ref) => {
    const residentData = resident || {
      fullName: request.residentName,
      address: request.address,
      yearsOfResidency: '____',
    }

    return (
      <div ref={ref} className="print-document bg-white p-8 max-w-2xl mx-auto font-serif text-black" style={{ minHeight: '11in' }}>
        <BarangayHeader />
        
        <h2 className="text-xl font-bold text-center mb-8 underline">CERTIFICATE OF RESIDENCY</h2>
        
        <p className="mb-6 font-semibold">TO WHOM IT MAY CONCERN:</p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          This is to certify that <span className="font-bold underline">{residentData.fullName}</span> is 
          a bonafide resident of <span className="font-bold">Barangay Santiago, San Antonio, Zambales</span>.
        </p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          He/She has been residing in this barangay for <span className="font-bold">{typeof residentData.yearsOfResidency === 'number' ? `${residentData.yearsOfResidency} years` : '______ years'}</span>.
        </p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          Issued upon request for <span className="font-bold underline">{request.purpose}</span>.
        </p>
        
        <SignatureSection captain={captain} />
        <DocumentFooter request={request} />
      </div>
    )
  }
)
CertificateOfResidencyTemplate.displayName = 'CertificateOfResidencyTemplate'

// Certificate of Indigency Template
export const CertificateOfIndigencyTemplate = forwardRef<HTMLDivElement, DocumentTemplateProps>(
  ({ request, resident, captain = "Hon. Roberto S. Dela Cruz" }, ref) => {
    const residentData = resident || {
      fullName: request.residentName,
      address: request.address,
    }

    return (
      <div ref={ref} className="print-document bg-white p-8 max-w-2xl mx-auto font-serif text-black" style={{ minHeight: '11in' }}>
        <BarangayHeader />
        
        <h2 className="text-xl font-bold text-center mb-8 underline">CERTIFICATE OF INDIGENCY</h2>
        
        <p className="mb-6 font-semibold">TO WHOM IT MAY CONCERN:</p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          This is to certify that <span className="font-bold underline">{residentData.fullName}</span> is 
          an indigent resident of <span className="font-bold">Barangay Santiago, San Antonio, Zambales</span>.
        </p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          He/She belongs to a low-income family and is in need of financial assistance.
        </p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          Issued upon request for <span className="font-bold underline">{request.purpose}</span>.
        </p>
        
        <SignatureSection captain={captain} />
        <DocumentFooter request={request} />
      </div>
    )
  }
)
CertificateOfIndigencyTemplate.displayName = 'CertificateOfIndigencyTemplate'

// Business Permit Template
export const BusinessPermitTemplate = forwardRef<HTMLDivElement, DocumentTemplateProps>(
  ({ request, resident, captain = "Hon. Roberto S. Dela Cruz" }, ref) => {
    const residentData = resident || {
      fullName: request.residentName,
      address: request.address,
    }

    return (
      <div ref={ref} className="print-document bg-white p-8 max-w-2xl mx-auto font-serif text-black" style={{ minHeight: '11in' }}>
        <BarangayHeader />
        
        <h2 className="text-xl font-bold text-center mb-8 underline">BARANGAY BUSINESS CLEARANCE</h2>
        
        <p className="mb-6 font-semibold">TO WHOM IT MAY CONCERN:</p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          This is to certify that <span className="font-bold underline">{residentData.fullName}</span>, 
          owner of <span className="font-bold underline">{request.purpose}</span>, 
          located at <span className="font-bold">{residentData.address || 'Barangay Santiago, San Antonio, Zambales'}</span>, 
          is granted clearance to operate.
        </p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          This certification is issued in connection with the application for a Mayor&apos;s Permit.
        </p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          Issued this <span className="font-bold">{request.approvedAt ? format(new Date(request.approvedAt), 'do') : '____'}</span> day 
          of <span className="font-bold">{request.approvedAt ? format(new Date(request.approvedAt), 'MMMM, yyyy') : '____________, 20__'}</span>.
        </p>
        
        <SignatureSection captain={captain} />
        <DocumentFooter request={request} />
      </div>
    )
  }
)
BusinessPermitTemplate.displayName = 'BusinessPermitTemplate'

// Certificate of Good Moral Character Template
export const GoodMoralTemplate = forwardRef<HTMLDivElement, DocumentTemplateProps>(
  ({ request, resident, captain = "Hon. Roberto S. Dela Cruz" }, ref) => {
    const residentData = resident || {
      fullName: request.residentName,
      address: request.address,
    }

    return (
      <div ref={ref} className="print-document bg-white p-8 max-w-2xl mx-auto font-serif text-black" style={{ minHeight: '11in' }}>
        <BarangayHeader />
        
        <h2 className="text-xl font-bold text-center mb-8 underline">CERTIFICATE OF GOOD MORAL CHARACTER</h2>
        
        <p className="mb-6 font-semibold">TO WHOM IT MAY CONCERN:</p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          This is to certify that <span className="font-bold underline">{residentData.fullName}</span>, 
          a resident of <span className="font-bold">{residentData.address || 'Barangay Santiago, San Antonio, Zambales'}</span>, 
          is known to be a person of good moral character and reputation in this community.
        </p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          He/She has no pending case or derogatory record filed in this barangay.
        </p>
        
        <p className="mb-6 text-justify leading-relaxed indent-8">
          Issued upon request for <span className="font-bold underline">{request.purpose}</span>.
        </p>
        
        <SignatureSection captain={captain} />
        <DocumentFooter request={request} />
      </div>
    )
  }
)
GoodMoralTemplate.displayName = 'GoodMoralTemplate'

// Blotter Report Template
interface BlotterTemplateProps {
  blotter: BlotterReport
  captain?: string
  secretary?: string
}

export const BlotterReportTemplate = forwardRef<HTMLDivElement, BlotterTemplateProps>(
  ({ blotter, captain = "Hon. Roberto S. Dela Cruz", secretary = "Maria Santos" }, ref) => {
    return (
      <div ref={ref} className="print-document bg-white p-8 max-w-2xl mx-auto font-serif text-black" style={{ minHeight: '11in' }}>
        <BarangayHeader />
        
        <h2 className="text-xl font-bold text-center mb-8 underline">BARANGAY BLOTTER</h2>
        
        <div className="space-y-4 text-sm">
          <div className="flex gap-4">
            <p className="w-48"><span className="font-semibold">Barangay Blotter No.:</span></p>
            <p className="flex-1 border-b border-black">{blotter.blotterNumber || '_______________'}</p>
          </div>
          
          <div className="flex gap-4">
            <p className="w-48"><span className="font-semibold">Date / Petsa:</span></p>
            <p className="flex-1 border-b border-black">{format(new Date(blotter.createdAt), 'MMMM d, yyyy')}</p>
          </div>
          
          <div className="flex gap-4">
            <p className="w-48"><span className="font-semibold">Name / Title ng Kaso:</span></p>
            <p className="flex-1 border-b border-black">{blotter.incidentType}</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <p className="w-48"><span className="font-semibold">Nature ng Kaso:</span></p>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <span className={`w-4 h-4 border border-black inline-flex items-center justify-center ${blotter.caseNature === 'civil' ? 'bg-black text-white' : ''}`}>
                  {blotter.caseNature === 'civil' && '✓'}
                </span>
                Civil Case
              </label>
              <label className="flex items-center gap-1">
                <span className={`w-4 h-4 border border-black inline-flex items-center justify-center ${blotter.caseNature === 'criminal' ? 'bg-black text-white' : ''}`}>
                  {blotter.caseNature === 'criminal' && '✓'}
                </span>
                Criminal Case
              </label>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <h3 className="font-bold">1. MGA SANGKOT (PARTIES INVOLVED)</h3>
          <div className="ml-4 space-y-2 text-sm">
            <p><span className="font-semibold">Complainant(s):</span> {blotter.complainantName}</p>
            <p><span className="font-semibold">Address:</span> {blotter.complainantAddress}</p>
            <p><span className="font-semibold">Respondent(s):</span> {blotter.respondentName}</p>
            <p><span className="font-semibold">Address:</span> {blotter.respondentAddress || 'N/A'}</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <h3 className="font-bold">2. DETALYE NG INSIDENTE</h3>
          <div className="ml-4 space-y-2 text-sm">
            <p><span className="font-semibold">Ano / What happened:</span></p>
            <p className="border border-gray-300 p-2 min-h-20">{blotter.description}</p>
            <p><span className="font-semibold">Saan / Where (Location):</span> {blotter.location}</p>
            <p><span className="font-semibold">Kailan / When:</span> {format(new Date(blotter.incidentDate), 'MMMM d, yyyy')} at {blotter.incidentTime}</p>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <h3 className="font-bold">3. LAYUNIN NG PAGPA-BLOTTER</h3>
          <div className="ml-4 text-sm">
            <p>{blotter.purpose}</p>
          </div>
        </div>
        
        {blotter.remarks && (
          <div className="mt-6 space-y-4">
            <h3 className="font-bold">4. KARAGDAGANG DETALYE / REMARKS</h3>
            <div className="ml-4 text-sm">
              <p>{blotter.remarks}</p>
            </div>
          </div>
        )}
        
        <div className="mt-12 flex justify-between">
          <div className="text-center">
            <div className="border-b border-black w-48 mb-1" />
            <p className="font-semibold">{captain}</p>
            <p className="text-sm">Punong Barangay</p>
          </div>
          <div className="text-center">
            <div className="border-b border-black w-48 mb-1" />
            <p className="font-semibold">{secretary}</p>
            <p className="text-sm">Barangay Secretary</p>
          </div>
        </div>
      </div>
    )
  }
)
BlotterReportTemplate.displayName = 'BlotterReportTemplate'

// Get the appropriate template component based on document type
export function getDocumentTemplate(documentType: string) {
  const templates: Record<string, typeof BarangayClearanceTemplate> = {
    'Barangay Clearance': BarangayClearanceTemplate,
    'Certificate of Residency': CertificateOfResidencyTemplate,
    'Certificate of Indigency': CertificateOfIndigencyTemplate,
    'Business Permit': BusinessPermitTemplate,
    'Certificate of Good Moral Character': GoodMoralTemplate,
  }
  return templates[documentType] || BarangayClearanceTemplate
}
