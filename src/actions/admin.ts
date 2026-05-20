"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import type { ActionState } from "./auth";

export async function createCategoryAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const slug = slugify(parsed.data.name);

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
    },
  });

  revalidatePath("/categories");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteCategoryAction(categoryId: string): Promise<ActionState> {
  await requireAdmin();
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/categories");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateUserRoleAction(
  userId: string,
  role: Role
): Promise<ActionState> {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteUserAction(userId: string): Promise<ActionState> {
  const admin = await requireAdmin();
  if (admin.id === userId) return { error: "নিজেকে মুছতে পারবেন না" };

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin");
  return { success: true };
}

export async function getAdminStats() {
  await requireAdmin();

  const [userCount, postCount, publishedCount, commentCount, categoryCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.comment.count(),
      prisma.category.count(),
    ]);

  const topPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { viewCount: "desc" },
    take: 5,
    select: { id: true, title: true, slug: true, viewCount: true },
  });

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, createdAt: true, role: true },
  });

  return {
    userCount,
    postCount,
    publishedCount,
    commentCount,
    categoryCount,
    topPosts,
    recentUsers,
  };
}
