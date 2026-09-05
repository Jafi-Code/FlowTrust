const API_URL = import.meta.env.VITE_API_URL;

export interface Invoice {
  id?: string;
  _id?: string;
  invoice_number?: string;
  customer_name?: string;
  amount?: number;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
}

export async function getInvoices(): Promise<Invoice[]> {
  const response = await fetch(`${API_URL}/invoices/`);

  if (!response.ok) {
    throw new Error(`Failed to load invoices (${response.status})`);
  }

  return response.json();
}

export async function createInvoice(invoice: object) {
  const response = await fetch(`${API_URL}/invoices/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoice),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || `Failed to create invoice (${response.status})`,
    );
  }

  return response.json();
}

export async function verifyInvoice(invoiceId: string, data: object) {
  const response = await fetch(`${API_URL}/verification/${invoiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Verification failed (${response.status})`);
  }

  return response.json();
}
