"use client";

import { useState, useEffect } from "react";

type Campaign = {
  id: string;
  name: string;
};

type Transaction = {
  id: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  method: "UPI" | "CARD" | "WALLET";
  riskScore: number;
  createdAt: string;
  paymentLink: {
    url: string;
  };
};

export default function PaymentsPage() {
  const [amount, setAmount] = useState("");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const [txLoading, setTxLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txError, setTxError] = useState<string | null>(null);

  const [methodFilter, setMethodFilter] = useState<"ALL" | "UPI" | "CARD" | "WALLET">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUCCESS" | "FAILED" | "PENDING">("ALL");

  // Load campaigns for linking
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns");
        if (!res.ok) return;
        const data = (await res.json()) as Campaign[];
        setCampaigns(data);
      } catch {
        // silent fail for campaigns
      }
    };

    loadCampaigns();
  }, []);

  // Load recent transactions
  const loadTransactions = async () => {
    try {
      setTxLoading(true);
      setTxError(null);

      const res = await fetch("/api/transactions?limit=20");
      if (!res.ok) {
        throw new Error("Failed to load transactions");
      }
      const data = (await res.json()) as Transaction[];
      setTransactions(data);
    } catch {
      setTxError("Could not load recent transactions.");
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Generate payment link
  const generateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLink(true);
    setGeneratedLink("");

    try {
      const res = await fetch("/api/payment-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          campaignId: campaignId || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate link");
      }

      const data = await res.json();
      setGeneratedLink(data.url);
      setAmount("");
      setCampaignId("");
    } catch {
      // optional: show toast later
    } finally {
      setLoadingLink(false);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const methodOk = methodFilter === "ALL" || tx.method === methodFilter;
    const statusOk = statusFilter === "ALL" || tx.status === statusFilter;
    return methodOk && statusOk;
  });

  const formatAmount = (value: number) => `₹${value.toFixed(2)}`;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusClass = (status: Transaction["status"]) => {
    if (status === "SUCCESS") return "text-emerald-300 bg-emerald-500/10 border-emerald-500/40";
    if (status === "FAILED") return "text-rose-300 bg-rose-500/10 border-rose-500/40";
    return "text-amber-200 bg-amber-500/10 border-amber-500/40";
  };

  const riskClass = (score: number) => {
    if (score >= 60) return "text-rose-300";
    if (score >= 30) return "text-amber-200";
    return "text-emerald-300";
  };

  return (
    <div className="flex-1 px-4 py-6 md:px-8 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-sm text-slate-400">
          Generate payment links and review simulated transaction activity.
        </p>
      </header>

      {/* Generate Payment Link */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5 max-w-xl space-y-4">
        <h2 className="text-sm font-medium">Generate payment link</h2>

        <form onSubmit={generateLink} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Amount (₹)</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 outline-none focus:border-emerald-400 text-sm"
              value={amount}
              min={1}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300">
              Linked campaign (optional)
            </label>
            <select
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 outline-none focus:border-emerald-400 text-sm"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
            >
              <option value="">None</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loadingLink}
            className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60"
          >
            {loadingLink ? "Generating..." : "Generate link"}
          </button>
        </form>

        {generatedLink && (
          <div className="mt-3 p-3 rounded-lg border border-slate-700 bg-slate-950 text-xs space-y-1">
            <p className="text-slate-300">Payment link</p>
            <p className="text-emerald-400 break-all">{generatedLink}</p>
          </div>
        )}
      </section>

      {/* Recent Transactions */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium text-slate-200">
              Recent transactions
            </h2>
            <p className="text-[11px] text-slate-500">
              Last 20 simulated payments captured for this merchant.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <select
              className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 outline-none"
              value={methodFilter}
              onChange={(e) =>
                setMethodFilter(e.target.value as typeof methodFilter)
              }
            >
              <option value="ALL">All methods</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="WALLET">Wallet</option>
            </select>

            <select
              className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 outline-none"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as typeof statusFilter)
              }
            >
              <option value="ALL">All statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>

            <button
              onClick={loadTransactions}
              className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-[11px] text-slate-300 hover:bg-slate-900"
            >
              Refresh
            </button>
          </div>
        </div>

        {txLoading && (
          <p className="text-xs text-slate-500">Loading transactions...</p>
        )}

        {txError && (
          <p className="text-xs text-amber-300">{txError}</p>
        )}

        {!txLoading && filteredTransactions.length === 0 && !txError && (
          <p className="text-xs text-slate-500">
            No transactions yet. Generate a payment link and complete a test payment
            to see it here.
          </p>
        )}

        {filteredTransactions.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="min-w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="px-3 py-2 text-left font-medium text-slate-400">
                    Time
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-400">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-400">
                    Method
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-400">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-400">
                    Risk
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-slate-400">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-t border-slate-800 hover:bg-slate-900/80"
                  >
                    <td className="px-3 py-2 text-slate-300">
                      {formatDate(tx.createdAt)}
                    </td>
                    <td className="px-3 py-2 text-slate-200">
                      {formatAmount(tx.amount)}
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {tx.method}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${statusClass(
                          tx.status
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`text-[11px] ${riskClass(tx.riskScore)}`}>
                        {tx.riskScore}/100
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-400 max-w-[120px] truncate">
                      /p/{tx.paymentLink.url}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
