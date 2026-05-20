"use client";

import { useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("ইমেইল বা পাসওয়ার্ড ভুল");
      } else {
        toast.success("স্বাগতম!");
        router.push(callbackUrl);
        router.refresh();
      }
    });
  }

  return (
    <div className="glass rounded-2xl p-8 max-w-md w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">লগইন</h1>
      <p className="text-muted-foreground text-center mb-6">
        আপনার অ্যাকাউন্টে প্রবেশ করুন
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">ইমেইল</Label>
          <Input id="email" name="email" type="email" required placeholder="you@email.com" />
        </div>
        <div
          className="space-y-2"
        >
          <Label htmlFor="password">পাসওয়ার্ড</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "লগইন করুন"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/register" className="text-primary hover:underline">
          নিবন্ধন করুন
        </Link>
      </p>
    </div>
  );
}
