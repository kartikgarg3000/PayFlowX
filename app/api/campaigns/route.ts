import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function getCurrentMerchant() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { merchant: true },
  });

  if (!user || !user.merchant) return null;

  return user.merchant;
}

export async function GET() {
  const merchant = await getCurrentMerchant();

  if (!merchant) {
    return new NextResponse("Merchant not found", { status: 404 });
  }

  const campaigns = await prisma.campaign.findMany({
    where: { merchantId: merchant.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(campaigns);
}

export async function POST(req: Request) {
  const merchant = await getCurrentMerchant();

  if (!merchant) {
    return new NextResponse("Merchant not found", { status: 404 });
  }

  const body = await req.json().catch(() => null);

  if (!body || !body.name || !body.type) {
    return new NextResponse("Invalid body", { status: 400 });
  }

  const { name, description, type, scheduledAt } = body as {
    name: string;
    description?: string;
    type: "WHATSAPP_ONLY" | "WHATSAPP_WITH_PAYMENT";
    scheduledAt?: string | null;
  };

  const campaign = await prisma.campaign.create({
    data: {
      merchantId: merchant.id,
      name,
      description,
      type,
      status: "DRAFT",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
  });

  return NextResponse.json(campaign, { status: 201 });
}
