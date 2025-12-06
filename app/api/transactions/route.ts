import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

export async function GET(req: Request) {
  const merchant = await getMerchant();
  if (!merchant) {
    return new NextResponse("Merchant not found", { status: 404 });
  }

  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) || 20 : 20;

  const transactions = await prisma.transaction.findMany({
    where: {
      paymentLink: {
        merchantId: merchant.id,
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      paymentLink: {
        select: {
          url: true,
        },
      },
    },
  });

  return NextResponse.json(transactions);
}
