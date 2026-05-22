import { notFound } from "next/navigation";
import { getCategoryBySlug, getPublishedPosts } from "@/lib/queries";
import { StoryCard } from "@/components/story-card";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? "বিভাগ" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { posts, totalPages } = await getPublishedPosts({
    categorySlug: slug,
    page,
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-muted-foreground mb-10">{category.description}</p>
      )}

      {posts.length === 0 ? (
        <EmptyState title="এই বিভাগে কোনো গল্প নেই" />
      ) : (
        <>
          <div className="space-y-6">
            {posts.map((post, i) => (
              <StoryCard key={post.id} post={post} index={i} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/categories/${slug}`}
          />
        </>
      )}
    </div>
  );
}
