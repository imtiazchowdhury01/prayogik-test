"use client"
export const handlePrintCertificate = () => {
  // Get the application details card element
  const printContent = document.querySelector('.bg-white.border.rounded-lg');
  
  if (!printContent) {
    console.error("Print content not found");
    return;
  }

  // Clone the element to avoid modifying the original
  const contentClone = printContent.cloneNode(true) as HTMLElement;
  
  // Add a title for the print document
  const title = document.createElement('h2');
  title.textContent = 'আবেদনের বিবরণ সনদপত্র';
  title.style.textAlign = 'center';
  title.style.fontSize = '24px';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '20px';
  contentClone.prepend(title);

  // Create a hidden iframe for printing
  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  printFrame.style.overflow = 'hidden';
  document.body.appendChild(printFrame);

  const printDocument = printFrame.contentDocument || printFrame.contentWindow?.document;
  
  if (!printDocument) {
    console.error("Could not create print document");
    return;
  }

  printDocument.open();
  printDocument.write(`
    <!DOCTYPE html>
    <html lang="bn">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>আবেদনের বিবরণ সনদপত্র</title>
      <script src="https://unpkg.com/lucide@latest"></script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap');
        
        body { 
          font-family: 'Hind Siliguri', Arial, sans-serif;
          padding: 20px;
          color: #1f2937;
          background-color: #f0fdf4;
        }
        
        @page { 
          size: A4; 
          margin: 15mm;
        }
        
        .print-container {
          border: 2px solid #bbf7d0;
          border-radius: 0.5rem;
          padding: 2rem;
          background: #f0fdf4;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        
        .space-y-4 > * + * {
          margin-top: 1rem;
        }
        
        .text-sm {
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        
        .text-gray-600 {
          color: #4b5563;
        }
        
        .text-gray-800 {
          color: #1f2937;
        }
        
        .font-semibold {
          font-weight: 600;
        }
        
        .mb-1 {
          margin-bottom: 0.25rem;
        }
        
        .flex {
          display: flex;
        }
        
        .items-center {
          align-items: center;
        }
        
        .gap-2 {
          gap: 0.5rem;
        }
        
        .text-gray-500 {
          color: #6b7280;
        }
        
        @media print {
          body {
            padding: 0;
            background-color: transparent;
          }
          
          .print-container {
            border: 2px solid #bbf7d0;
            background: #f0fdf4;
            padding: 1.5rem;
            margin: 0 auto;
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        ${contentClone.innerHTML}
      </div>
      <script>
        lucide.createIcons();
        setTimeout(function() {
          window.print();
          window.onafterprint = function() {
            document.body.removeChild(document.querySelector('iframe'));
          };
        }, 500);
      </script>
    </body>
    </html>
  `);
  printDocument.close();
};