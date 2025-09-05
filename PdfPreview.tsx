import React from 'react';
import type { Invoice } from '../types';

interface PdfPreviewProps {
  invoice: Invoice;
  total: number;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({ invoice, total }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-cyan-400 border-b border-gray-700 pb-2 mb-6">Live Preview</h2>
      <div className="bg-white text-black p-8 rounded-sm shadow-2xl aspect-[210/297] overflow-auto">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-4xl font-bold text-gray-800">INVOICE</h1>
          <div className="text-right">
            <h2 className="text-lg font-semibold">{invoice.from.name}</h2>
            <p className="text-gray-600 text-sm">{invoice.from.address.replace(',', ',\n')}</p>
            <p className="text-gray-600 text-sm">{invoice.from.email}</p>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <h3 className="font-bold text-gray-700">Bill To:</h3>
            <p>{invoice.to.name}</p>
            <p className="text-gray-600 text-sm">{invoice.to.address.replace(',', ',\n')}</p>
            <p className="text-gray-600 text-sm">{invoice.to.email}</p>
          </div>
          <div className="text-right">
            <p><span className="font-bold">Invoice #:</span> {invoice.invoiceNumber}</p>
            <p><span className="font-bold">Date:</span> {invoice.invoiceDate}</p>
            <p><span className="font-bold">Due Date:</span> {invoice.dueDate}</p>
          </div>
        </div>
        
        <table className="w-full text-left mb-8">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 font-bold">Description</th>
              <th className="p-2 font-bold text-right">Qty</th>
              <th className="p-2 font-bold text-right">Price</th>
              <th className="p-2 font-bold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map(item => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="p-2">{item.description}</td>
                <td className="p-2 text-right">{item.quantity}</td>
                <td className="p-2 text-right">{invoice.currency}{item.price.toFixed(2)}</td>
                <td className="p-2 text-right">{invoice.currency}{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-1/3">
            <div className="flex justify-between">
              <span className="font-bold">Total:</span>
              <span className="font-bold">{invoice.currency}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div>
            <h4 className="font-bold mb-1">Notes:</h4>
            <p className="text-gray-600 text-sm">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfPreview;
