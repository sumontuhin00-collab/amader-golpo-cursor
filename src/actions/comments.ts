"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { commentSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { revalidatePath } from "next/cache";
import type { ActionState } from "./auth";

export async function createCommentAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireAuth();
  const { success } = rateLimit(`comment-${user.id}`, 20, 60_000);
  if (!success) return { error: "অনেক দ্রুত মন্তব্য। কিছুক্ষণ অপেক্ষা করুন।" };

  const raw = {
    content: formData.get("content") as string,
    postId: formData.get("postId") as string,
    parentId: (formData.get("parentId") as string) || undefined,
  };

  const parsed = commentSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const post = await prisma.post.findUnique({
    where: { id: parsed.data.postId },
  });
  if (!post) return { error: "গল্প পাওয়া যায়নি" };

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      postId: parsed.data.postId,
      authorId: user.id,
      parentId: parsed.data.parentId || null,
    },
  });

  revalidatePath(`/story/${post.slug}`);
  return { success: true };
}

export async function deleteCommentAction(commentId: string): Promise<ActionState> {
  const user = await requireAuth();

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: true },
  });
  if (!comment) return { error: "মন্তব্য পাওয়া যায়নি" };
  if (comment.authorId !== user.id && user.role !== "ADMIN") {
    return { error: "অনুমতি নেই" };
  }

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/story/${comment.post.slug}`);
  return { success: true };
}
