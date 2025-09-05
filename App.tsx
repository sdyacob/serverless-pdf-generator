import React, { useState, useCallback } from 'react';
import { useInvoice } from './hooks/useInvoice';
import InvoiceForm from './components/InvoiceForm';
import PdfPreview from './components/PdfPreview';
import { CogIcon } from './components/icons/CogIcon';
import { DocumentArrowDownIcon } from './components/icons/DocumentArrowDownIcon';

// This is to inform TypeScript about the global jspdf object from the script tag
declare const jspdf: any;

const App: React.FC = () => {
  const { invoice, updateField, updateParty, addItem, removeItem, updateItem, total } = useInvoice();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGeneratePdf = useCallback(async () => {
    setIsGenerating(true);
    setPdfUrl(null);
    try {
      // Simulate network delay for a better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { jsPDF } = jspdf;
      const doc = new jsPDF();
      
      // Set fonts and colors
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('INVOICE', 14, 22);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.from.name, 14, 40);
      invoice.from.address.split(',').forEach((line, i) => {
        doc.text(line.trim(), 14, 45 + (i * 5));
      });
      doc.text(invoice.from.email, 14, 60);

      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', 120, 40);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.to.name, 120, 45);
      invoice.to.address.split(',').forEach((line, i) => {
        doc.text(line.trim(), 120, 50 + (i * 5));
      });
      doc.text(invoice.to.email, 120, 65);

      doc.setFont('helvetica', 'bold');
      doc.text('Invoice Number:', 14, 80);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.invoiceNumber, 50, 80);

      doc.setFont('helvetica', 'bold');
      doc.text('Invoice Date:', 14, 85);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.invoiceDate, 50, 85);

      doc.setFont('helvetica', 'bold');
      doc.text('Due Date:', 14, 90);
      doc.setFont('helvetica', 'normal');
      doc.text(invoice.dueDate, 50, 90);

      // Table Header
      doc.setDrawColor(200);
      doc.setFillColor(240, 240, 240);
      doc.rect(14, 100, 182, 10, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.text('Description', 16, 106);
      doc.text('Qty', 125, 106);
      doc.text('Price', 150, 106);
      doc.text('Total', 178, 106);
      
      // Table Rows
      let y = 116;
      doc.setFont('helvetica', 'normal');
      invoice.items.forEach(item => {
        const itemTotal = (item.quantity * item.price).toFixed(2);
        doc.text(item.description, 16, y);
        doc.text(String(item.quantity), 125, y);
        doc.text(`${invoice.currency}${item.price.toFixed(2)}`, 150, y);
        doc.text(`${invoice.currency}${itemTotal}`, 178, y);
        y += 7;
      });

      // Total
      doc.setDrawColor(200);
      doc.line(120, y, 196, y);
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Total:', 150, y);
      doc.text(`${invoice.currency}${total.toFixed(2)}`, 178, y);

      // Notes
      if (invoice.notes) {
        y += 15;
        doc.setFont('helvetica', 'bold');
        doc.text('Notes:', 14, y);
        doc.setFont('helvetica', 'normal');
        const splitNotes = doc.splitTextToSize(invoice.notes, 182);
        doc.text(splitNotes, 14, y + 5);
      }
      
      const pdfDataUri = doc.output('datauristring');
      setPdfUrl(pdfDataUri);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [invoice, total]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400">Serverless PDF Generator</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="flex items-center justify-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
          >
            {isGenerating ? (
              <>
                <CogIcon className="animate-spin h-5 w-5 mr-2" />
                Generating...
              </>
            ) : (
              'Generate PDF'
            )}
          </button>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={`Invoice-${invoice.invoiceNumber}.pdf`}
              className="flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Download PDF
            </a>
          )}
        </div>
      </header>

      <main className="p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InvoiceForm 
          invoice={invoice} 
          updateField={updateField}
          updateParty={updateParty}
          addItem={addItem}
          removeItem={removeItem}
          updateItem={updateItem}
          total={total}
        />
        <PdfPreview 
          invoice={invoice}
          total={total}
        />
      </main>
    </div>
  );
};

export default App;
