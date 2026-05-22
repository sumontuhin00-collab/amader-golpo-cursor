import { getPublishedPosts } from "@/lib/queries";
import { StoryCard } from "@/components/story-card";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import { Suspense } from "react";
import { SearchFilters } from "@/components/search-filters";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";
export const metadata = { title: "অনুসন্ধান" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const sort = params.sort === "popular" ? "popular" : "latest";

  const { posts, totalPages } = await getPublishedPosts({
    search: params.q,
    tag: params.tag,
    sort,
    page,
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">অনুসন্ধান</h1>
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <SearchFilters />
      </Suspense>

      {params.q && (
        <p className="text-muted-foreground mb-6">
          &quot;{params.q}&quot; এর জন্য ফলাফল
        </p>
      )}

      {posts.length === 0 ? (
        <EmptyState
          title="কোনো গল্প পাওয়া যায়নি"
          description="অন্য শব্দ দিয়ে খুঁজে দেখুন"
        />
      ) : (
        <>
          <div
            className="space-y-6"
          >
            {posts.map((post, i) => (
              <StoryCard key={post.id} post={post} index={i} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/search"
            searchParams={{
              ...(params.q && { q: params.q }),
              ...(params.tag && { tag: params.tag }),
              ...(params.sort && { sort: params.sort }),
            }}
          />
        </>
      )}
    </div>
  );
}
