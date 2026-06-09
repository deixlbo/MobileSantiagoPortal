import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
    return (error as any).message
  }
  return fallback
}

export function printElementById(id: string) {
  if (typeof window === 'undefined') return

  const element = document.getElementById(id)
  if (!element) return

  // Create a new window for printing
  const printWindow = window.open('', 'PrintDocument', 'width=800,height=600')
  if (!printWindow) {
    console.error('Failed to open print window')
    return
  }

  // Copy the full element HTML content, including wrapper styles
  const content = element.outerHTML

  // Write HTML to the new window with print styles
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Print Document</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @page {
          size: A4;
          margin: 0.5in;
        }

        html, body {
          width: 100%;
          min-height: 100%;
          background: #fff;
          color: #000;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #000;
          background: #fff;
          padding: 0.5in;
        }

        .document-container {
          max-width: 8.5in;
          margin: 0 auto;
        }

        .document-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #333;
          padding-bottom: 0.2in;
          margin-bottom: 0.3in;
        }

        .logo-placeholder {
          width: 0.8in;
          height: 0.8in;
          border-radius: 50%;
          background: #f0f0f0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10pt;
          color: #666;
          flex-shrink: 0;
        }

        .header-text {
          flex: 1;
          padding: 0 0.25in;
          text-align: center;
        }

        .header-text p {
          margin: 0;
          font-size: 10pt;
          line-height: 1.4;
        }

        .header-text .main-title {
          margin-top: 0.1in;
          font-size: 13pt;
          font-weight: 700;
          color: #000;
        }

        .document-title {
          text-align: center;
          margin: 0.25in 0 0.2in;
        }

        .document-title h1 {
          font-size: 18pt;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.1in;
        }

        .document-title p {
          margin: 0;
          font-size: 10pt;
          color: #333;
        }

        .document-body {
          margin-bottom: 0.4in;
          text-align: justify;
          font-size: 11pt;
        }

        .document-body p {
          margin-bottom: 0.18in;
        }

        .greeting {
          font-weight: 700;
          margin-bottom: 0.15in;
        }

        .signature-area {
          margin-top: 0.4in;
          padding-top: 0.2in;
        }

        .signature-line {
          width: 2.6in;
          border-bottom: 1px solid #000;
          margin-bottom: 0.12in;
        }

        .signature-name {
          font-size: 11pt;
          font-weight: 700;
          margin-bottom: 0.05in;
        }

        .signature-title {
          font-size: 10pt;
        }

        .footer {
          margin-top: 0.4in;
          padding-top: 0.15in;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 9pt;
          color: #555;
        }

        img {
          max-width: 100%;
          height: auto;
          display: block;
        }

        @media print {
          body {
            padding: 0;
          }

          .document-container {
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `)

  printWindow.document.close()
  printWindow.document.title = 'Print Document'

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}
