"use client";
export default function DashboardPage() {
  return (
    <div className="flex-1 px-4 py-6 md:px-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-slate-400">
            High-level snapshot of your campaigns, payments and risk.
          </p>
        </div>
        <button className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400">
          New campaign
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 mb-1">Total payments captured</p>
          <p className="text-2xl font-semibold text-emerald-400">₹0</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Live data will appear once transactions start flowing.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 mb-1">Active campaigns</p>
          <p className="text-2xl font-semibold text-sky-400">0</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Create your first WhatsApp + payment campaign to see insights here.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 mb-1">High-risk attempts</p>
          <p className="text-2xl font-semibold text-rose-400">0</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Risk engine will flag suspicious behaviors in real-time.
          </p>
        </div>
      </section>
    </div>
  );
}
