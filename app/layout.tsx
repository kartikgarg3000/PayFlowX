import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayFlowX",
  description: "AI-powered WhatsApp + payment automation dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-slate-950 text-slate-50">{children}</body>
      </html>
    </ClerkProvider>
  );
}
