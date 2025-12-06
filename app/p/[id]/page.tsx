"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type LinkInfo = {
  id: string;
  amount: number;
  merchantName: string;
  status: "ACTIVE" | "EXPIRED";
};

type Result = {
  status: "PENDING" | "SUCCESS" | "FAILED";
  riskScore: number;
  method: "UPI" | "CARD" | "WALLET";
};

export default function PaymentPage() {
  const params = useParams();
  const id = (params?.id as string) || "";

  const [link, setLink] = useState<LinkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<"UPI" | "CARD" | "WALLET">("UPI");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/payment-links/${id}`);
        if (!res.ok) {
          throw new Error("Not found");
        }
        const data = (await res.json()) as LinkInfo;
        setLink(data);
      } catch {
        setError("This payment link is invalid or expired.");
        setLink(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link) return;

    setPaying(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/payments/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentLinkId: link.id,
          method,
        }),
      });

      if (!res.ok) {
        throw new Error("Payment failed");
      }

      const data = (await res.json()) as Result;
      setResult(data);
    } catch {
      setError("Something went wrong while processing payment.");
    } finally {
      setPaying(false);
    }
  };

  // Loading skeleton
  if (loading || !id) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-20 rounded bg-slate-800" />
              <div className="h-4 w-32 rounded bg-slate-800" />
            </div>
            <div className="h-8 w-8 rounded-xl bg-slate-800" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-slate-800" />
            <div className="h-8 w-32 rounded bg-slate-800" />
          </div>
          <div className="h-9 w-full rounded-full bg-slate-800" />
        </div>
      </main>
    );
  }

  // Invalid / expired link state
  if (error || !link) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-5 space-y-3 text-center">
          <h1 className="text-lg font-semibold">Payment link unavailable</h1>
          <p className="text-xs text-slate-400">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center mt-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-1.5 text-[11px] text-slate-200 hover:bg-slate-900"
          >
            Go to homepage
          </Link>
        </div>
      </main>
    );
  }

  const formattedAmount = `₹${link.amount.toFixed(2)}`;

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 shadow-lg shadow-slate-950/60">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Pay to</p>
            <p className="text-sm font-semibold">{link.merchantName}</p>
          </div>
          <span className="h-8 w-8 rounded-xl bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold">
            P
          </span>
        </div>

        {/* Amount */}
        <div>
          <p className="text-xs text-slate-400 mb-1">Amount</p>
          <p className="text-3xl font-semibold text-emerald-400">
            {formattedAmount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            This is a simulated payment experience for demo purposes only.
          </p>
        </div>

        {/* Payment form */}
        <form onSubmit={handlePay} className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-slate-300">Payment method</p>
            <div className="flex gap-2 text-[11px]">
              {(["UPI", "CARD", "WALLET"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`px-3 py-1.5 rounded-full border transition ${
                    method === m
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                      : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={paying}
            className="w-full rounded-full bg-emerald-500 text-slate-950 text-sm font-medium py-2.5 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {paying ? "Processing..." : "Pay now"}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-[11px] space-y-1">
            <p className="text-slate-300">Payment result</p>
            <p>
              Status:{" "}
              <span
                className={
                  result.status === "SUCCESS"
                    ? "text-emerald-300"
                    : result.status === "FAILED"
                    ? "text-rose-300"
                    : "text-amber-300"
                }
              >
                {result.status}
              </span>
            </p>
            <p>Risk score: {result.riskScore}/100</p>
            <p>Method: {result.method}</p>
          </div>
        )}

        {/* Error (during pay) */}
        {error && (
          <p className="text-[11px] text-rose-300 mt-1">{error}</p>
        )}

        {/* Back to dashboard */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            Merchant console available on dashboard.
          </p>
          <Link
            href="/dashboard"
            className="text-[11px] text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
