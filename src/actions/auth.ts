"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { generateUniqueUsername } from "@/lib/username";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  username?: string;
};

export async function registerAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const ip = "register";
  const { success } = rateLimit(ip, 5, 300_000);
  if (!success) return { error: "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" };

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) return { error: "এই ইমেইল ইতিমধ্যে নিবন্ধিত" };

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
  const username = await generateUniqueUsername(parsed.data.name, parsed.data.email);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      username,
      email: parsed.data.email,
      password: hashedPassword,
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch {
    return { success: true };
  }

  return { success: true };
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState & { redirectTo?: string }> {
  const ip = "login";
  const { success } = rateLimit(ip, 10, 60_000);
  if (!success) return { error: "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।" };

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
    return { success: true, redirectTo: callbackUrl };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "ইমেইল বা পাসওয়ার্ড ভুল" };
    }
    throw error;
  }
}
