import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const { userId } = await auth(); // ⬅️ yahan await add kiya

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress || "unknown@example.com";
  const name =
    clerkUser?.fullName ||
    clerkUser?.username ||
    clerkUser?.firstName ||
    "User";

  // 1) Ensure User exists
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        name,
      },
    });
  }

  // 2) Ensure Merchant exists
  let merchant = await prisma.merchant.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!merchant) {
    merchant = await prisma.merchant.create({
      data: {
        userId: user.id,
        businessName: "My First Business",
      },
    });
  }

  return NextResponse.json({
    ok: true,
    userId: user.id,
    merchantId: merchant.id,
    businessName: merchant.businessName,
  });
}
