import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  Plus,
  LogOut,
  Bell,
  Search,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { getInvoices, type Invoice } from "./services/api";

type Page = "dashboard" | "create" | "verification";

function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold">FlowTrust</h1>
              <p className="text-xs text-slate-500">Trust Infrastructure</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <button
            onClick={() => setPage("dashboard")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
              page === "dashboard"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => setPage("create")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
              page === "create"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText size={18} />
            Invoices
          </button>

          <button
            onClick={() => setPage("verification")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
              page === "verification"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck size={18} />
            Verification
          </button>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-600 hover:bg-slate-100">
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div>
            <h2 className="text-xl font-semibold">
              {page === "dashboard" && "Dashboard"}
              {page === "create" && "Invoices"}
              {page === "verification" && "Verification"}
            </h2>

            <p className="text-sm text-slate-500">
              Monitor invoice trust and payment risk
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
              <Bell size={20} />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold">
                FT
              </div>

              <div>
                <p className="text-sm font-medium">FlowTrust Admin</p>
                <p className="text-xs text-slate-500">Business Account</p>
              </div>
            </div>
          </div>
        </header>

        {page === "dashboard" && <Dashboard />}
        {page === "create" && <CreateInvoice />}
        {page === "verification" && <Verification />}
      </main>
    </div>
  );
}

function Dashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInvoices() {
      try {
        setLoading(true);
        const data = await getInvoices();
        setInvoices(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load invoices",
        );
      } finally {
        setLoading(false);
      }
    }

    loadInvoices();
  }, []);

  const verifiedCount = invoices.filter(
    (invoice) => String(invoice.status).toLowerCase() === "verified",
  ).length;

  const pendingCount = invoices.length - verifiedCount;

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Good morning 👋</h3>
          <p className="mt-1 text-slate-500">
            Here's what's happening with your business today.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Stat
          title="Total Invoices"
          value={String(invoices.length)}
          change="Live"
          icon={<FileText size={20} />}
        />

        <Stat
          title="Verified"
          value={String(verifiedCount)}
          change="Live"
          icon={<ShieldCheck size={20} />}
        />

        <Stat
          title="Pending"
          value={String(pendingCount)}
          change="Needs review"
          icon={<AlertTriangle size={20} />}
        />

        <Stat
          title="Trust Score"
          value="87"
          change="+4.2%"
          icon={<ArrowUpRight size={20} />}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h3 className="font-semibold">Recent invoices</h3>
              <p className="text-sm text-slate-500">Latest transactions</p>
            </div>

            <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100">
              <Search size={16} />
              Search
            </button>
          </div>

          {loading && (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading invoices...
            </div>
          )}

          {error && (
            <div className="m-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && invoices.length === 0 && (
            <div className="p-10 text-center">
              <FileText className="mx-auto text-slate-400" size={32} />

              <h4 className="mt-3 font-semibold">No invoices yet</h4>

              <p className="mt-1 text-sm text-slate-500">
                Create your first invoice to get started.
              </p>
            </div>
          )}

          {!loading && !error && invoices.length > 0 && (
            <div className="divide-y divide-slate-100">
              {invoices.slice(0, 5).map((invoice, index) => (
                <InvoiceRow
                  key={String(invoice._id ?? invoice.id ?? index)}
                  invoice={
                    invoice.invoice_number ??
                    `INV-${String(index + 1).padStart(3, "0")}`
                  }
                  customer={invoice.customer_name ?? "Unknown customer"}
                  amount={
                    invoice.amount !== undefined
                      ? `R${Number(invoice.amount).toLocaleString()}`
                      : "-"
                  }
                  status={invoice.status ?? "Pending"}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold">Trust overview</h3>
          <p className="mt-1 text-sm text-slate-500">
            Current business trust level
          </p>

          <div className="flex flex-col items-center py-8">
            <div className="flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-emerald-100">
              <div className="text-center">
                <p className="text-4xl font-bold">87</p>
                <p className="text-xs text-slate-500">/ 100</p>
              </div>
            </div>

            <div className="mt-5 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Low Risk
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-5">
            <RiskItem label="Invoice consistency" value="Strong" />
            <RiskItem label="Business verification" value="Verified" />
            <RiskItem label="Payment behaviour" value="Good" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-slate-100 p-3 text-slate-700">{icon}</div>

        <span className="text-xs font-medium text-emerald-600">{change}</span>
      </div>

      <p className="mt-5 text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}

function InvoiceRow({
  invoice,
  customer,
  amount,
  status,
}: {
  invoice: string;
  customer: string;
  amount: string;
  status: string;
}) {
  const verified = status === "Verified";

  return (
    <div className="flex items-center justify-between px-6 py-5">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
          <FileText size={18} />
        </div>

        <div>
          <p className="font-medium">{invoice}</p>
          <p className="text-sm text-slate-500">{customer}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold">{amount}</p>

        <span
          className={`text-xs font-medium ${
            verified ? "text-emerald-600" : "text-amber-600"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function RiskItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function CreateInvoice() {
  return (
    <div className="p-8">
      <div className="max-w-3xl">
        <h3 className="text-2xl font-bold">Create Invoice</h3>
        <p className="mt-1 text-slate-500">
          Create a new invoice for verification.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Invoice form coming next.</p>
        </div>
      </div>
    </div>
  );
}

function Verification() {
  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold">Invoice Verification</h3>
      <p className="mt-1 text-slate-500">
        Verify an invoice and calculate its trust score.
      </p>

      <div className="mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-500">
          Verification interface coming next.
        </p>
      </div>
    </div>
  );
}

export default App;
