export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  from: {
    name: string;
    address: string;
    email: string;
  };
  to: {
    name: string;
    address: string;
    email: string;
  };
  items: LineItem[];
  notes: string;
  currency: string;
}
