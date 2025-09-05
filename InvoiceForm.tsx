import React from 'react';
import type { Invoice, LineItem } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';

interface InvoiceFormProps {
  invoice: Invoice;
  updateField: <K extends keyof Invoice>(field: K, value: Invoice[K]) => void;
  updateParty: (party: 'from' | 'to', field: string, value: string) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => void;
  total: number;
}

const InputField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string}> = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white"
    />
  </div>
);

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  updateField,
  updateParty,
  addItem,
  removeItem,
  updateItem,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
      <h2 className="text-xl font-bold text-cyan-400 border-b border-gray-700 pb-2">Invoice Details</h2>

      {/* From/To Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300">From</h3>
          <InputField label="Name" value={invoice.from.name} onChange={(e) => updateParty('from', 'name', e.target.value)} />
          <InputField label="Address" value={invoice.from.address} onChange={(e) => updateParty('from', 'address', e.target.value)} />
          <InputField label="Email" value={invoice.from.email} onChange={(e) => updateParty('from', 'email', e.target.value)} type="email" />
        </div>
        <div className="space-y-4 bg-gray-900/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300">To</h3>
          <InputField label="Name" value={invoice.to.name} onChange={(e) => updateParty('to', 'name', e.target.value)} />
          <InputField label="Address" value={invoice.to.address} onChange={(e) => updateParty('to', 'address', e.target.value)} />
          <InputField label="Email" value={invoice.to.email} onChange={(e) => updateParty('to', 'email', e.target.value)} type="email" />
        </div>
      </div>

      {/* Invoice Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Invoice Number" value={invoice.invoiceNumber} onChange={(e) => updateField('invoiceNumber', e.target.value)} />
          <InputField label="Invoice Date" value={invoice.invoiceDate} onChange={(e) => updateField('invoiceDate', e.target.value)} type="date" />
          <InputField label="Due Date" value={invoice.dueDate} onChange={(e) => updateField('dueDate', e.target.value)} type="date" />
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-300 border-t border-gray-700 pt-4">Items</h3>
        {invoice.items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-gray-700/50 p-2 rounded-md">
            <div className="col-span-12 md:col-span-6">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                className="w-full bg-gray-600 border-gray-500 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                className="w-full bg-gray-600 border-gray-500 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                className="w-full bg-gray-600 border-gray-500 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
              />
            </div>
            <div className="col-span-3 md:col-span-1 text-right text-gray-300">
              {(item.quantity * item.price).toFixed(2)}
            </div>
            <div className="col-span-1 flex justify-end">
              <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addItem}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-cyan-300 bg-gray-700 rounded-md hover:bg-gray-600"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-400">Notes</label>
        <textarea
          value={invoice.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={3}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default InvoiceForm;
