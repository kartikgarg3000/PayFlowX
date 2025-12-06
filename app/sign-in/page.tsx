"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <SignIn
        appearance={{
          elements: {
            card: "bg-slate-900 border border-slate-800",
          },
        }}
      />
    </main>
  );
}
