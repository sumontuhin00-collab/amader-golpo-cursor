"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { profileSchema } from "@/lib/validations";
import { sanitizeUsernameBase, isValidUsername } from "@/lib/username";
import { revalidatePath } from "next/cache";
import type { ActionState } from "./auth";

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();

  const raw = {
    name: formData.get("name") as string,
    username: (formData.get("username") as string).toLowerCase().trim(),
    bio: (formData.get("bio") as string) || undefined,
  };

  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const normalizedUsername = sanitizeUsernameBase(parsed.data.username);
  if (!isValidUsername(normalizedUsername)) {
    return { error: "ইউজারনেম সঠিক নয়" };
  }

  if (normalizedUsername !== parsed.data.username) {
    return { fieldErrors: { username: ["ইউজারনেম ফরম্যাট সঠিক নয়"] } };
  }

  const existing = await prisma.user.findFirst({
    where: {
      username: normalizedUsername,
      NOT: { id: user.id },
    },
  });
  if (existing) {
    return { error: "এই ইউজারনেম ইতিমধ্যে নেওয়া হয়েছে" };
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      username: normalizedUsername,
      bio: parsed.data.bio,
    },
    select: { username: true },
  });

  revalidatePath(`/profile/${updated.username}`);
  revalidatePath("/profile/edit");
  revalidatePath("/dashboard");
  return { success: true, username: updated.username ?? undefined };
}

export async function updateAvatarAction(imageUrl: string): Promise<ActionState> {
  const user = await requireAuth();

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { image: imageUrl },
    select: { username: true },
  });

  revalidatePath(`/profile/${updated.username}`);
  revalidatePath("/profile/edit");
  return { success: true };
}
