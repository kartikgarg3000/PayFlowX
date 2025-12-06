import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function getDashboardData() {
  const { userId } = await auth();

  // If not authenticated, just return safe defaults
  if (!userId) {
    return {
      businessName: "Workspace",
      totalCampaigns: 0,
      lastCampaignName: null as string | null,
    };
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      merchant: true,
    },
  });

  if (!user || !user.merchant) {
    return {
      businessName: "Workspace",
      totalCampaigns: 0,
      lastCampaignName: null as string | null,
    };
  }

  const merchantId = user.merchant.id;

  const [totalCampaigns, lastCampaign] = await Promise.all([
    prisma.campaign.count({
      where: { merchantId },
    }),
    prisma.campaign.findFirst({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    businessName: user.merchant.businessName,
    totalCampaigns,
    lastCampaignName: lastCampaign?.name ?? null,
  };
}

export default async function DashboardPage() {
  const { businessName, totalCampaigns, lastCampaignName } =
    await getDashboardData();

  return (
    <div className="flex-1 px-4 py-6 md:px-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-slate-400">
            Workspace: <span className="text-slate-200">{businessName}</span>
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 mb-1">
            Total campaigns
          </p>
          <p className="text-2xl font-semibold text-sky-400">
            {totalCampaigns}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            WhatsApp and WhatsApp + payment campaigns for this merchant.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 mb-1">
            Last created campaign
          </p>
          <p className="text-sm font-semibold text-slate-100 line-clamp-2">
            {lastCampaignName || "No campaigns created yet"}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            This will update as you create new campaigns.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 mb-1">
            High-risk attempts
          </p>
          <p className="text-2xl font-semibold text-rose-400">0</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Risk engine metrics will appear once payment & risk flows are
            connected.
          </p>
        </div>
      </section>
    </div>
  );
}
