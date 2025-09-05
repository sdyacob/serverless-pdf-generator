import { useState, useCallback, useMemo } from 'react';
import type { Invoice, LineItem } from '../types';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getDueDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
}

const initialInvoice: Invoice = {
  invoiceNumber: 'INV-001',
  invoiceDate: getTodayDate(),
  dueDate: getDueDate(),
  from: {
    name: 'Your Company',
    address: '123 Main St, Anytown, USA',
    email: 'contact@yourcompany.com',
  },
  to: {
    name: 'Client Company',
    address: '456 Oak Ave, Sometown, USA',
    email: 'client@example.com',
  },
  items: [
    { id: crypto.randomUUID(), description: 'Web Development Services', quantity: 10, price: 150 },
    { id: crypto.randomUUID(), description: 'UI/UX Design', quantity: 5, price: 100 },
  ],
  notes: 'Thank you for your business!',
  currency: '$',
};

export const useInvoice = () => {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);

  const updateField = useCallback(<K extends keyof Invoice>(field: K, value: Invoice[K]) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateParty = useCallback((party: 'from' | 'to', field: string, value: string) => {
    setInvoice((prev) => ({
      ...prev,
      [party]: {
        ...prev[party],
        [field]: value,
      },
    }));
  }, []);

  const addItem = useCallback(() => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      price: 0,
    };
    setInvoice((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  }, []);

  const updateItem = useCallback((id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const total = useMemo(() => {
    return invoice.items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  }, [invoice.items]);

  return {
    invoice,
    updateField,
    updateParty,
    addItem,
    removeItem,
    updateItem,
    total,
  };
};
