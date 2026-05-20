import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "লগইন" };

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Suspense fallback={<Skeleton className="h-96 w-full max-w-md rounded-2xl" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
