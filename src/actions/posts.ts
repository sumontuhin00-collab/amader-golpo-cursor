"use server";

import { prisma } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { postSchema } from "@/lib/validations";
import { slugify, estimateReadTime } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import { PostStatus } from "@prisma/client";
import type { ActionState } from "./auth";

export async function createPostAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState & { postId?: string }> {
  const user = await requireAuth();
  const { success } = rateLimit(`post-create-${user.id}`, 10, 60_000);
  if (!success) return { error: "অনেক দ্রুত অনুরোধ। কিছুক্ষণ অপেক্ষা করুন।" };

  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    content: formData.get("content") as string,
    categoryId: (formData.get("categoryId") as string) || undefined,
    tags,
    coverImage: (formData.get("coverImage") as string) || "",
    status: formData.get("status") as "DRAFT" | "PUBLISHED",
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let slug = slugify(parsed.data.title);
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now()}`;

  const post = await prisma.post.create({
    data: {
      title: parsed.data.title,
      slug,
      description: parsed.data.description,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage || null,
      status: parsed.data.status as PostStatus,
      tags: parsed.data.tags ?? [],
      readTime: estimateReadTime(parsed.data.content),
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      authorId: user.id,
      categoryId: parsed.data.categoryId || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true, postId: post.id };
}

export async function updatePostAction(
  postId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "গল্প পাওয়া যায়নি" };
  if (post.authorId !== user.id && user.role !== "ADMIN") {
    return { error: "অনুমতি নেই" };
  }

  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    content: formData.get("content") as string,
    categoryId: (formData.get("categoryId") as string) || undefined,
    tags,
    coverImage: (formData.get("coverImage") as string) || "",
    status: formData.get("status") as "DRAFT" | "PUBLISHED",
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      content: parsed.data.content,
      coverImage: parsed.data.coverImage || null,
      status: parsed.data.status as PostStatus,
      tags: parsed.data.tags ?? [],
      readTime: estimateReadTime(parsed.data.content),
      publishedAt:
        parsed.data.status === "PUBLISHED" && !post.publishedAt
          ? new Date()
          : post.publishedAt,
      categoryId: parsed.data.categoryId || null,
    },
  });

  revalidatePath(`/story/${post.slug}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deletePostAction(postId: string): Promise<ActionState> {
  const user = await requireAuth();

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "গল্প পাওয়া যায়নি" };
  if (post.authorId !== user.id && user.role !== "ADMIN") {
    return { error: "অনুমতি নেই" };
  }

  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function adminDeletePostAction(postId: string): Promise<ActionState> {
  await requireAdmin();
  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function toggleLikeAction(postId: string): Promise<{ liked: boolean }> {
  const user = await requireAuth();
  const { success } = rateLimit(`like-${user.id}`, 30, 60_000);
  if (!success) return { liked: false };

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId: user.id, postId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    revalidatePath(`/story`);
    return { liked: false };
  }

  await prisma.like.create({ data: { userId: user.id, postId } });
  revalidatePath(`/story`);
  return { liked: true };
}

export async function toggleBookmarkAction(
  postId: string
): Promise<{ bookmarked: boolean }> {
  const user = await requireAuth();

  const existing = await prisma.bookmark.findUnique({
    where: { userId_postId: { userId: user.id, postId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return { bookmarked: false };
  }

  await prisma.bookmark.create({ data: { userId: user.id, postId } });
  return { bookmarked: true };
}

export async function incrementViewAction(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } },
  });
}
