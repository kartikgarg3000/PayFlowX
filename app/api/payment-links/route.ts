import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";

async function getMerchant() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { merchant: true },
  });

  if (!user?.merchant) return null;
  return user.merchant;
}

export async function POST(req: Request) {
  const merchant = await getMerchant();
  if (!merchant) {
    return new NextResponse("Merchant not found", { status: 404 });
  }

  const body = (await req.json().catch(() => null)) as
    | { amount?: number; campaignId?: string | null }
    | null;

  const amount = body?.amount;
  const campaignId = body?.campaignId ?? null;

  if (!amount || amount < 1) {
    return new NextResponse("Invalid amount", { status: 400 });
  }

  // yeh hi slug hai jo /p/:id me use hoga
  const slug = createId();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const fullUrl = `${baseUrl}/p/${slug}`;

  const link = await prisma.paymentLink.create({
    data: {
      merchantId: merchant.id,
      campaignId,
      amount,
      // IMPORTANT: DB me sirf slug store ho raha hai
      url: slug,
    },
  });

  return NextResponse.json({
    id: link.id,
    slug,
    url: fullUrl,
    amount: link.amount,
    campaignId: link.campaignId,
  });
}
