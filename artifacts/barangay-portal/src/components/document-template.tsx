import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, ShieldCheck } from 'lucide-react';
import { formatPHP, formatDateLong, getOrdinalDay, calculateAge } from '@/lib/format';
import { printArea } from '@/lib/print';

export const BarangayHeader = () => (
  <div className="text-center mb-8 border-b-2 border-primary pb-6">
    <div className="flex items-center justify-center gap-4 mb-4">
      <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center">
        <ShieldCheck className="w-12 h-12 text-primary" />
      </div>
      <div>
        <div className="font-serif text-sm">REPUBLIC OF THE PHILIPPINES</div>
        <div className="font-serif text-sm">PROVINCE OF ZAMBALES</div>
        <div className="font-serif text-sm">MUNICIPALITY OF SAN ANTONIO</div>
        <div className="font-serif font-bold text-lg mt-1 text-primary">BARANGAY SANTIAGO</div>
      </div>
    </div>
    <div className="font-serif font-bold text-xl mt-4">OFFICE OF THE PUNONG BARANGAY</div>
  </div>
);

export const Signatures = () => (
  <div className="mt-16 flex justify-between items-end">
    <div className="text-left text-sm font-serif">
      <div className="border-t border-black w-40 pt-1 text-center">Right Thumbmark</div>
    </div>
    <div className="text-center">
      <div className="font-bold font-serif text-lg uppercase underline">Hon. Roberto S. Dela Cruz</div>
      <div className="font-serif text-sm">Punong Barangay</div>
    </div>
  </div>
);

export const DocumentTemplate = ({ request, resident }: { request: any; resident: any }) => {
  const date = new Date(request.requestedDate || new Date());
  const ordinalDay = getOrdinalDay(date);
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  const year = date.getFullYear();

  const renderContent = () => {
    switch (request.documentType) {
      case "Barangay Clearance":
      case "Certificate of Good Moral Character":
        return (
          <>
            <h1 className="font-serif font-bold text-2xl text-center mb-8 uppercase underline tracking-widest">{request.documentType}</h1>
            <div className="font-serif text-justify leading-loose space-y-4">
              <p>TO WHOM IT MAY CONCERN:</p>
              <p>
                This is to certify that <strong>{request.residentName.toUpperCase()}</strong>, 
                {resident ? ` ${calculateAge(resident.birthDate)} years of age, ${resident.civilStatus}, ` : ' '} 
                is a bonafide resident of <strong>{resident?.purok || 'this barangay'}</strong>, Barangay Santiago, San Antonio, Zambales.
              </p>
              <p>
                This certifies further that the above-named person is of <strong>good moral character</strong>, a law-abiding citizen, and has <strong>no derogatory record</strong> filed in this office as of this date.
              </p>
              <p>
                This certification is being issued upon the request of the interested party for <strong>{request.purpose.toUpperCase()}</strong>.
              </p>
              <p>
                Issued this <strong>{ordinalDay}</strong> day of <strong>{month}, {year}</strong> at Barangay Santiago, San Antonio, Zambales.
              </p>
            </div>
          </>
        );
      case "Certificate of Residency":
        return (
          <>
            <h1 className="font-serif font-bold text-2xl text-center mb-8 uppercase underline tracking-widest">CERTIFICATE OF RESIDENCY</h1>
            <div className="font-serif text-justify leading-loose space-y-4">
              <p>TO WHOM IT MAY CONCERN:</p>
              <p>
                This is to certify that <strong>{request.residentName.toUpperCase()}</strong>, of legal age, is a permanent and bonafide resident of <strong>{resident?.address || 'Barangay Santiago, San Antonio, Zambales'}</strong>.
              </p>
              <p>
                Based on the records of this office, he/she has been residing in this barangay and is known to be a peaceful and law-abiding citizen.
              </p>
              <p>
                This certification is issued upon the request of the above-named person for <strong>{request.purpose.toUpperCase()}</strong> and for whatever legal intent it may serve.
              </p>
              <p>
                Given this <strong>{ordinalDay}</strong> day of <strong>{month}, {year}</strong>.
              </p>
            </div>
          </>
        );
      case "Certificate of Indigency":
        return (
          <>
            <h1 className="font-serif font-bold text-2xl text-center mb-8 uppercase underline tracking-widest">CERTIFICATE OF INDIGENCY</h1>
            <div className="font-serif text-justify leading-loose space-y-4">
              <p>TO WHOM IT MAY CONCERN:</p>
              <p>
                This is to certify that <strong>{request.residentName.toUpperCase()}</strong>, is a bonafide resident of Barangay Santiago, San Antonio, Zambales.
              </p>
              <p>
                This further certifies that the above-named resident belongs to one of the indigent families in this barangay whose income is not sufficient to meet their daily basic needs.
              </p>
              <p>
                This certification is issued for <strong>{request.purpose.toUpperCase()}</strong> purposes.
              </p>
              <p>
                Issued this <strong>{ordinalDay}</strong> day of <strong>{month}, {year}</strong>.
              </p>
            </div>
          </>
        );
      case "Business Permit":
        return (
          <>
            <h1 className="font-serif font-bold text-2xl text-center mb-8 uppercase underline tracking-widest">BARANGAY BUSINESS CLEARANCE</h1>
            <div className="font-serif text-justify leading-loose space-y-4">
              <p>TO WHOM IT MAY CONCERN:</p>
              <p>
                Clearance is hereby granted to <strong>{request.residentName.toUpperCase()}</strong>, to operate the business known as:
              </p>
              <p className="text-center font-bold text-xl uppercase underline my-6">
                {request.businessName || '________________________'}
              </p>
              <p>
                located at <strong>{request.businessAddress || resident?.address || '________________________'}</strong>, Barangay Santiago, San Antonio, Zambales.
              </p>
              <p>
                This clearance is granted subject to the provisions of the existing Barangay Ordinances, Rules and Regulations.
              </p>
              <p>
                Given this <strong>{ordinalDay}</strong> day of <strong>{month}, {year}</strong>.
              </p>
            </div>
          </>
        );
      default:
        return (
          <>
            <h1 className="font-serif font-bold text-2xl text-center mb-8 uppercase underline tracking-widest">{request.documentType}</h1>
            <div className="font-serif text-justify leading-loose space-y-4">
              <p>TO WHOM IT MAY CONCERN:</p>
              <p>
                This is to certify that <strong>{request.residentName.toUpperCase()}</strong>, is a resident of Barangay Santiago.
              </p>
              <p>
                This document is issued for <strong>{request.purpose}</strong>.
              </p>
              <p>
                Issued this <strong>{ordinalDay}</strong> day of <strong>{month}, {year}</strong>.
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-white text-black p-8 mx-auto w-full max-w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:m-0 print:p-0">
      <BarangayHeader />
      <div className="mb-4 text-sm font-serif">
        {request.controlNo && <div>Control No: {request.controlNo}</div>}
        {request.orNumber && <div>OR No: {request.orNumber}</div>}
      </div>
      {renderContent()}
      <Signatures />
      <div className="mt-12 text-sm font-serif">
        <div>Doc. Stamp: Paid</div>
      </div>
    </div>
  );
};

export const BlotterTemplate = ({ report }: { report: any }) => {
  return (
    <div className="bg-white text-black p-8 mx-auto w-full max-w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:m-0 print:p-0 font-serif">
      <BarangayHeader />
      <h1 className="font-bold text-2xl text-center mb-8 uppercase underline tracking-widest">BARANGAY INCIDENT REPORT</h1>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 text-sm">
        <div><strong>Case Reference:</strong> {report.referenceNo}</div>
        <div><strong>Date Reported:</strong> {formatDateLong(report.dateReported)}</div>
        <div><strong>Complainant:</strong> {report.reporter}</div>
        <div><strong>Respondent:</strong> {report.respondent || 'Unknown / Not stated'}</div>
        <div><strong>Category:</strong> {report.category}</div>
        <div><strong>Location:</strong> {report.location}</div>
        <div><strong>Status:</strong> <span className="uppercase">{report.status}</span></div>
        {report.dateResolved && <div><strong>Date Resolved:</strong> {formatDateLong(report.dateResolved)}</div>}
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold uppercase border-b border-black mb-2">Incident Narrative</h3>
          <p className="whitespace-pre-wrap text-justify">{report.description}</p>
        </div>

        {report.actionTaken && (
          <div>
            <h3 className="font-bold uppercase border-b border-black mb-2">Action Taken</h3>
            <p className="whitespace-pre-wrap text-justify">{report.actionTaken}</p>
          </div>
        )}

        {report.resolutionNotes && (
          <div>
            <h3 className="font-bold uppercase border-b border-black mb-2">Resolution / Remarks</h3>
            <p className="whitespace-pre-wrap text-justify">{report.resolutionNotes}</p>
          </div>
        )}
      </div>

      <div className="mt-16 grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="border-b border-black pt-8 mb-1 px-4 inline-block min-w-[200px]">{report.preparedBy || '________________________'}</div>
          <div>Prepared By</div>
        </div>
        <div className="text-center">
          <div className="border-b border-black pt-8 mb-1 px-4 inline-block min-w-[200px] font-bold uppercase">Hon. Roberto S. Dela Cruz</div>
          <div>Punong Barangay</div>
        </div>
      </div>
    </div>
  );
};

export const OrdinancePreview = ({ ordinance }: { ordinance: any }) => {
  const sections = ordinance.description.split('\n\n').filter(Boolean);

  return (
    <div className="bg-white text-black p-8 mx-auto w-full max-w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:m-0 print:p-0 font-serif">
      <BarangayHeader />
      <h1 className="font-bold text-xl text-center mb-2 uppercase underline">BARANGAY {ordinance.ordinanceType.toUpperCase()} NO. {ordinance.ordinanceNumber}</h1>
      <h2 className="font-bold text-lg text-center mb-8 uppercase px-12">{ordinance.title}</h2>
      
      <div className="text-justify leading-loose mb-6">
        <strong>BE IT ORDAINED BY THE SANGGUNIANG BARANGAY:</strong>
      </div>

      <div className="space-y-4 text-justify leading-loose">
        {sections.map((sec: string, i: number) => (
          <p key={i}>
            <strong>Section {i + 1}.</strong> {sec}
          </p>
        ))}
      </div>

      <div className="mt-12 text-justify leading-loose">
        <p><strong>ENACTED AND APPROVED</strong> this {ordinance.enactedDate ? formatDateLong(ordinance.enactedDate) : '_____ day of ________, 20__'} at Barangay Santiago, San Antonio, Zambales.</p>
      </div>

      <div className="mt-16 text-center">
        <div className="font-bold text-lg uppercase underline">Hon. Roberto S. Dela Cruz</div>
        <div>Punong Barangay</div>
      </div>
    </div>
  );
};

export const ProjectReport = ({ project }: { project: any }) => {
  return (
    <div className="bg-white text-black p-8 mx-auto w-full max-w-[210mm] min-h-[297mm] shadow-lg print:shadow-none print:m-0 print:p-0 font-serif">
      <BarangayHeader />
      <h1 className="font-bold text-2xl text-center mb-8 uppercase underline tracking-widest">PROJECT ACCOMPLISHMENT REPORT</h1>
      
      <table className="w-full border-collapse mb-8 text-sm">
        <tbody>
          <tr>
            <td className="border border-black p-2 font-bold w-1/3">Project Title</td>
            <td className="border border-black p-2 uppercase">{project.title}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold">Category</td>
            <td className="border border-black p-2 uppercase">{project.category}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold">Project Leader</td>
            <td className="border border-black p-2 uppercase">{project.projectLeader}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold">Budget</td>
            <td className="border border-black p-2">{formatPHP(project.budget)}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold">Duration</td>
            <td className="border border-black p-2">{formatDateLong(project.startDate)} to {formatDateLong(project.targetDate)}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold">Status</td>
            <td className="border border-black p-2 uppercase">{project.status} ({project.progress}%)</td>
          </tr>
        </tbody>
      </table>

      <div className="space-y-4 text-justify">
        <h3 className="font-bold uppercase border-b border-black pb-1">Project Abstract / Description</h3>
        <p className="whitespace-pre-wrap">{project.description}</p>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="border-b border-black pt-8 mb-1 px-4 inline-block min-w-[200px] font-bold uppercase">{project.projectLeader}</div>
          <div>Project Leader</div>
        </div>
        <div className="text-center">
          <div className="border-b border-black pt-8 mb-1 px-4 inline-block min-w-[200px] font-bold uppercase">Hon. Roberto S. Dela Cruz</div>
          <div>Punong Barangay</div>
        </div>
      </div>
    </div>
  );
};

export const PrintModal = ({ title, open, onOpenChange, children }: { title: string; open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-none print:shadow-none print:border-none print:bg-white">
        <DialogHeader className="no-print border-b pb-4 flex flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <Button onClick={printArea} className="gap-2">
            <Printer className="w-4 h-4" /> Print Document
          </Button>
        </DialogHeader>
        <div className="print-area bg-muted/20 p-4 print:p-0 print:bg-transparent rounded-lg flex justify-center">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
