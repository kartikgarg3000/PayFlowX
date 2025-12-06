"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <SignUp
        appearance={{
          elements: {
            card: "bg-slate-900 border border-slate-800",
          },
        }}
      />
    </main>
  );
}
