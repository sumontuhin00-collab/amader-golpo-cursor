import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PostForm } from "@/components/posts/post-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "নতুন গল্প" };

export default async function CreatePostPage() {
  await requireAuth();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">নতুন গল্প লিখুন</h1>
      <PostForm categories={categories} />
    </div>
  );
}
