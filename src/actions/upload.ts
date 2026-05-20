"use server";

import { requireAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/supabase/storage";
import { rateLimit } from "@/lib/rate-limit";

export async function uploadCoverAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const user = await requireAuth();
  const { success } = rateLimit(`upload-${user.id}`, 10, 60_000);
  if (!success) return { error: "অনেক দ্রুত আপলোড। কিছুক্ষণ অপেক্ষা করুন।" };

  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { error: "ফাইল নির্বাচন করুন" };

  return uploadImage(file, "covers");
}

export async function uploadAvatarAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const user = await requireAuth();
  const { success } = rateLimit(`avatar-${user.id}`, 5, 60_000);
  if (!success) return { error: "অনেক দ্রুত আপলোড। কিছুক্ষণ অপেক্ষা করুন।" };

  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { error: "ফাইল নির্বাচন করুন" };

  return uploadImage(file, "avatars");
}
