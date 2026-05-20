"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerAction } from "@/actions/auth";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await registerAction({}, formData);
      if (result.error) toast.error(result.error);
      else if (result.success) {
        toast.success("নিবন্ধন সফল!");
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <div className="glass rounded-2xl p-8 max-w-md w-full">
      <h1 className="text-2xl font-bold mb-2 text-center">নিবন্ধন</h1>
      <p className="text-muted-foreground text-center mb-6">
        নতুন অ্যাকাউন্ট তৈরি করুন
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">নাম</Label>
          <Input id="name" name="name" required placeholder="আপনার নাম" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">ইমেইল</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">পাসওয়ার্ড</Label>
          <Input id="password" name="password" type="password" required minLength={6} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "নিবন্ধন করুন"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
        <Link href="/login" className="text-primary hover:underline">
          লগইন করুন
        </Link>
      </p>
    </div>
  );
}
