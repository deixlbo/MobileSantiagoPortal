import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function printElementById(id: string) {
  if (typeof window === 'undefined') return

  const element = document.getElementById(id)
  if (!element) return

  // Create a new window for printing
  const printWindow = window.open('', '', 'width=800,height=600')
  if (!printWindow) {
    console.error('Failed to open print window')
    return
  }

  // Copy the element's HTML content
  const content = element.innerHTML

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
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.5;
          color: #000;
          background: #fff;
          padding: 20px;
        }
        
        @media print {
          body {
            padding: 0;
          }
        }
        
        img {
          max-width: 100%;
          height: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        td, th {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `)

  printWindow.document.close()

  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}
