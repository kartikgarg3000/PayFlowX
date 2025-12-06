import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type BodyType = {
  paymentLinkId: string;
  method: "UPI" | "CARD" | "WALLET";
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as BodyType | null;

  if (!body || !body.paymentLinkId || !body.method) {
    return new NextResponse("Invalid body", { status: 400 });
  }

  const link = await prisma.paymentLink.findUnique({
    where: { id: body.paymentLinkId },
  });

  if (!link) {
    return new NextResponse("Payment link not found", { status: 404 });
  }

  // Random outcome
  const r = Math.random();
  let status: "PENDING" | "SUCCESS" | "FAILED" = "PENDING";

  if (r < 0.7) status = "SUCCESS";
  else if (r < 0.9) status = "FAILED";
  else status = "PENDING";

  // Simple risk logic: higher amount = more risk
  let riskScore = 10;
  if (link.amount > 50000) riskScore = 70;
  else if (link.amount > 20000) riskScore = 45;
  else if (link.amount > 5000) riskScore = 25;

  const tx = await prisma.transaction.create({
    data: {
      paymentLinkId: link.id,
      amount: link.amount,
      method: body.method,
      status,
      riskScore,
      attempts: 1,
      metadata: {
        simulated: true,
      },
    },
  });

  return NextResponse.json({
    id: tx.id,
    status: tx.status,
    riskScore: tx.riskScore,
    method: tx.method,
  });
}
