import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      {/* Navbar */}
      <header className="w-full border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xl font-bold">
              P
            </span>
            <span className="font-semibold text-lg tracking-tight">
              PayFlowX
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
            <span>AI · Automation · Payments</span>
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-full border border-emerald-400/70 text-emerald-300 hover:bg-emerald-400/10 text-[12px] font-medium"
            >
              Go to dashboard
            </Link>
            <Link
              href="/sign-in"
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
          {/* Left side */}
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300">
              AI-powered WhatsApp + Payment Automation
            </p>

            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
              Automate{" "}
              <span className="text-emerald-400">WhatsApp payments</span>{" "}
              with real-time{" "}
              <span className="underline decoration-emerald-400">
                funnels & risk insights
              </span>
              .
            </h1>

            <p className="text-slate-300 text-sm md:text-base max-w-xl">
              PayFlowX helps merchants send smart WhatsApp campaigns with
              integrated payment links, track conversions end-to-end, and
              analyze transaction patterns using an intelligent risk layer.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <button className="px-5 py-2.5 rounded-full bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400">
                  Open dashboard
                </button>
              </Link>
              <button className="px-5 py-2.5 rounded-full border border-slate-700 text-sm hover:bg-slate-900">
                View demo
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-[11px] text-slate-400">
              <span>⚡ WhatsApp campaigns</span>
              <span>📊 Conversion analytics</span>
              <span>🛡️ Risk scoring engine</span>
            </div>
          </div>

          {/* Right preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5 space-y-4">
            <p className="text-xs font-medium text-slate-300">
              Merchant snapshot
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 space-y-1">
                <p className="text-slate-400">Payments captured</p>
                <p className="text-lg font-semibold text-emerald-400">
                  ₹2,45,800
                </p>
                <p className="text-[11px] text-emerald-300/80">+18% growth</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 space-y-1">
                <p className="text-slate-400">WhatsApp CTR</p>
                <p className="text-lg font-semibold text-sky-400">
                  37.2%
                </p>
                <p className="text-[11px] text-sky-300/80">+9.4%</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 space-y-2 col-span-2">
                <p className="text-slate-400">Risk distribution</p>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="inline-flex h-2 w-16 rounded-full bg-emerald-400/80" />
                  <span>Low (82%)</span>
                  <span className="inline-flex h-2 w-10 rounded-full bg-amber-300/80" />
                  <span>Medium (13%)</span>
                  <span className="inline-flex h-2 w-6 rounded-full bg-rose-400/80" />
                  <span>High (5%)</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Built with modern web technologies for a smooth merchant
              automation experience.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} PayFlowX</span>
          <span>Modern automation for businesses</span>
        </div>
      </footer>
    </main>
  );
}
