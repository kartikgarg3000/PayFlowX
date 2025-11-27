"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/campaigns", label: "Campaigns" },
  { href: "/dashboard/payments", label: "Payments" },
  { href: "/dashboard/risk", label: "Risk & Fraud" },
  { href: "/dashboard/settlements", label: "Settlements" },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 flex-col border-r border-slate-800 bg-slate-950/80">
      <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-2">
        <span className="h-8 w-8 rounded-xl bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xl font-bold">
          P
        </span>
        <div>
          <p className="text-sm font-semibold">PayFlowX</p>
          <p className="text-[11px] text-slate-400">Merchant console</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 text-sm">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                active
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                  : "text-slate-300 hover:bg-slate-900/80"
              }`}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-slate-800 text-[11px] text-slate-500">
        Built by Kartik for PayU interviews
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="md:hidden border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-sm font-bold">
              P
            </span>
            <span className="text-sm font-semibold">PayFlowX</span>
          </div>
          {/* TODO: add mobile menu later */}
        </header>
        {children}
      </div>
    </div>
  );
}
