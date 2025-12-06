import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  // Next 16: params is a Promise, so we await it
  const { slug } = await context.params;

  if (!slug) {
    return new NextResponse("Missing slug", { status: 400 });
  }

  const link = await prisma.paymentLink.findUnique({
    where: { url: slug }, // url column me slug hi store hai
    include: {
      merchant: true,
    },
  });

  if (!link) {
    return new NextResponse("Payment link not found", { status: 404 });
  }

  return NextResponse.json({
    id: link.id,
    amount: link.amount,
    merchantName: link.merchant.businessName,
    status: link.status,
  });
}
