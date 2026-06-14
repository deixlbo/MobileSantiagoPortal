'use client';

import React from 'react';

interface A4PrintTemplateProps {
  header?: React.ReactNode;
  title?: string;
  children?: React.ReactNode;
  showLogos?: boolean;
  issuedDate?: Date;
  controlNumber?: string;
  requestNumber?: string;
}

export default function A4PrintTemplate({
  header,
  title = 'Certification',
  children,
  showLogos = true,
  issuedDate = new Date(),
  controlNumber = '______',
  requestNumber = '______',
}: A4PrintTemplateProps) {
  const formattedIssuedDate = issuedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 p-4">
      <div
        className="relative w-full bg-white overflow-hidden"
        style={{
          aspectRatio: '210 / 297',
          maxWidth: '210mm',
          height: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            border: '3px solid #000000',
            boxSizing: 'border-box',
          }}
        >
          <div
            className="absolute inset-0 bg-white flex flex-col overflow-hidden"
            style={{
              border: '6px solid #2d6a4f',
              boxSizing: 'border-box',
              top: '3px',
              left: '3px',
              right: '3px',
              bottom: '3px',
            }}
          >
            <div className="flex-1 flex flex-col items-center justify-start px-12 py-10 overflow-y-auto">
              {showLogos && (
                <div className="flex items-center justify-center w-full mb-3 gap-8">
                  <div className="flex-shrink-0">
                    <img
                      src="/logos/santiago-logo.png"
                      alt="Santiago Logo"
                      className="h-16 w-auto"
                    />
                  </div>
                  <div className="flex-1 text-center text-xs font-semibold leading-tight">
                    <p>Republic of the PHILIPPINES</p>
                    <p>Municipality of SAN ANTONIO</p>
                    <p>Barangay SANTIAGO</p>
                  </div>
                  <div className="flex-shrink-0">
                    <img
                      src="/logos/saz-logo.png"
                      alt="SAZ Logo"
                      className="h-16 w-auto"
                    />
                  </div>
                </div>
              )}

              <div className="w-full h-px bg-black my-2 mb-4" />

              {title && (
                <div className="mb-4 text-center">
                  <h1
                    className="text-5xl font-bold tracking-widest"
                    style={{
                      WebkitTextStroke: '1.5px #000000',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      fontFamily: 'Playbill, Georgia, serif',
                      letterSpacing: '0.2em',
                    }}
                  >
                    {title}
                  </h1>
                </div>
              )}

              <div className="w-full h-px bg-black my-1 mb-4" />

              <div className="w-full flex-1 flex flex-col justify-center">
                {children || (
                  <div className="space-y-4 text-sm leading-relaxed text-center">
                    <p className="text-center italic">To whom it may concern:</p>
                    <p>
                      This is to certify that <span className="font-semibold">________________________</span>, a bonafide resident of Barangay Santiago, San Antonio, Zambales, is residing at <span className="font-semibold">________________________</span>.
                    </p>
                    <p>
                      This certification is issued upon the request of the above-mentioned person for the purpose of <span className="font-semibold">________________________</span>.
                    </p>
                    <p>
                      Issued this <span className="font-semibold">{issuedDate.getDate()}</span> day of <span className="font-semibold">{issuedDate.toLocaleDateString('en-US', { month: 'long' })}</span>, <span className="font-semibold">{issuedDate.getFullYear()}</span>.
                    </p>
                  </div>
                )}
              </div>

              <div className="w-full mt-6 pt-4 border-t border-gray-300">
                <div className="text-center mb-6">
                  <p className="text-sm font-semibold">ROLANDO C. BORJA</p>
                  <p className="text-xs">Punong Barangay</p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="text-center">
                    <p className="font-semibold mb-6">Control No. {controlNumber}</p>
                    <p className="text-xs">Document Number</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold mb-6">Date Issued: {formattedIssuedDate}</p>
                    <p className="text-xs">Issued Date</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold mb-6">Request No. {requestNumber}</p>
                    <p className="text-xs">Request Number</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          @page {
            size: A4 portrait;
            margin: 0;
            padding: 0;
          }

          .bg-gray-100 {
            background: white !important;
            padding: 0 !important;
          }

          [style*="aspectRatio"] {
            page-break-after: avoid;
            page-break-inside: avoid;
            width: 210mm !important;
            height: 297mm !important;
            max-width: 100% !important;
          }

          * {
            page-break-inside: avoid;
          }

          img {
            max-width: 100%;
            height: auto;
          }
        }
      `}</style>
    </div>
  )
}
