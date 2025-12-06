"use client";

import { useEffect, useState } from "react";

type Campaign = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  type: string;
  scheduledAt?: string | null;
  createdAt: string;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"WHATSAPP_ONLY" | "WHATSAPP_WITH_PAYMENT">(
    "WHATSAPP_ONLY"
  );
  const [scheduledAt, setScheduledAt] = useState("");

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/campaigns");
      if (!res.ok) {
        throw new Error("Failed to load campaigns");
      }
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error(err);
      setError("Could not load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setFormLoading(true);
      setError(null);

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          type,
          scheduledAt: scheduledAt || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create campaign");
      }

      setName("");
      setDescription("");
      setType("WHATSAPP_ONLY");
      setScheduledAt("");

      await loadCampaigns();
    } catch (err) {
      console.error(err);
      setError("Could not create campaign.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="flex-1 px-4 py-6 md:px-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Campaigns
          </h1>
          <p className="text-sm text-slate-400">
            Create and manage your WhatsApp + payment campaigns.
          </p>
        </div>
      </header>

      {/* Create campaign form */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
        <h2 className="text-sm font-medium mb-3">Create new campaign</h2>
        <form
          onSubmit={handleCreateCampaign}
          className="space-y-4 text-sm max-w-xl"
        >
          <div className="space-y-1">
            <label className="block text-xs text-slate-300">
              Campaign name
            </label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jan UPI cashback blast"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-slate-300">
              Description (optional)
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400 min-h-[60px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short internal note about this campaign."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs text-slate-300">
                Campaign type
              </label>
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as
                    | "WHATSAPP_ONLY"
                    | "WHATSAPP_WITH_PAYMENT")
                }
              >
                <option value="WHATSAPP_ONLY">WhatsApp only</option>
                <option value="WHATSAPP_WITH_PAYMENT">
                  WhatsApp + payment links
                </option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-300">
                Schedule (optional)
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
              <p className="text-[11px] text-slate-500">
                Leave empty to run immediately later.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={formLoading}
              className="px-4 py-2 rounded-full bg-emerald-500 text-slate-950 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60"
            >
              {formLoading ? "Creating..." : "Create campaign"}
            </button>
            {error && (
              <span className="text-[11px] text-amber-300">{error}</span>
            )}
          </div>
        </form>
      </section>

      {/* Campaign list */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-200">
            Existing campaigns
          </h2>
          {loading && (
            <span className="text-[11px] text-slate-500">
              Loading...
            </span>
          )}
        </div>

        {!loading && campaigns.length === 0 && (
          <p className="text-xs text-slate-500">
            No campaigns yet. Create your first WhatsApp campaign above.
          </p>
        )}

        {campaigns.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-slate-100">
                    {c.name}
                  </h3>
                  <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                    {c.type === "WHATSAPP_WITH_PAYMENT"
                      ? "WA + Pay"
                      : "WhatsApp"}
                  </span>
                </div>
                {c.description && (
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {c.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Status: {c.status}</span>
                  <span>
                    Created:{" "}
                    {new Date(c.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
