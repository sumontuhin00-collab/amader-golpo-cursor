import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostForm } from "@/components/posts/post-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "গল্প সম্পাদনা" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();
  if (post.authorId !== user.id && user.role !== "ADMIN") redirect("/dashboard");

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">গল্প সম্পাদনা</h1>
      <PostForm categories={categories} post={post} />
    </div>
  );
}
