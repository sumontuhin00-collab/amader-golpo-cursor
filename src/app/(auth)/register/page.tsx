import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "নিবন্ধন" };

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <RegisterForm />
    </div>
  );
}
