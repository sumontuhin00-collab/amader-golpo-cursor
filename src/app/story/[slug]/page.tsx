import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/queries";
import { formatBengaliDate, formatBengaliNumber } from "@/lib/utils";
import { UserAvatarLink } from "@/components/profile/user-link";
import { Badge } from "@/components/ui/badge";
import { StoryCard } from "@/components/story-card";
import { StoryActions } from "@/components/story/story-actions";
import { CommentSection } from "@/components/comments/comment-section";
import { ViewCounter } from "@/components/story/view-counter";
import { Clock, Eye } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "গল্প পাওয়া যায়নি" };
  return {
    title: post.title,
    description: post.description ?? undefined,
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const session = await auth();
  const [related, userLike, userBookmark] = await Promise.all([
    getRelatedPosts(post.id, post.categoryId),
    session?.user
      ? prisma.like.findUnique({
          where: {
            userId_postId: { userId: session.user.id, postId: post.id },
          },
        })
      : null,
    session?.user
      ? prisma.bookmark.findUnique({
          where: {
            userId_postId: { userId: session.user.id, postId: post.id },
          },
        })
      : null,
  ]);

  return (
    <article>
      <ViewCounter postId={post.id} />

      {post.coverImage && (
        <div className="relative w-full h-[40vh] md:h-[50vh]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="mb-8">
          {post.category && (
            <Link href={`/categories/${post.category.slug}`}>
              <Badge className="mb-4">{post.category.name}</Badge>
            </Link>
          )}
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-xl text-muted-foreground mb-6">{post.description}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <UserAvatarLink user={post.author} size="md" showName />
              {post.publishedAt && (
                <p className="text-sm text-muted-foreground pl-12 sm:pl-0">
                  {formatBengaliDate(post.publishedAt)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} মিনিট পড়া
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatBengaliNumber(post.viewCount)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/search?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="outline">#{tag}</Badge>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <StoryActions
              postId={post.id}
              slug={post.slug}
              title={post.title}
              initialLiked={!!userLike}
              initialBookmarked={!!userBookmark}
              likeCount={post._count.likes}
            />
          </div>
        </header>

        <div
          className="prose-bengali"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <CommentSection postId={post.id} comments={post.comments} />

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">সম্পর্কিত গল্প</h2>
            <div className="space-y-6">
              {related.map((p, i) => (
                <StoryCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
