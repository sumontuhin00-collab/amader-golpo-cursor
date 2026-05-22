"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, CalendarDays, Clock3 } from "lucide-react";
import { formatBengaliDate, formatBengaliNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

type StoryCardProps = {
  post: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    coverImage?: string | null;
    readTime: number;
    viewCount: number;
    publishedAt?: Date | null;
    tags: string[];
    author: { id: string; username: string | null; name: string | null; image: string | null };
    category?: { name: string; slug: string } | null;
    _count: { likes: number; comments: number };
  };
  featured?: boolean;
  index?: number;
};

export function StoryCard({ post, featured = false, index = 0 }: StoryCardProps) {
  const authorName = post.author.name || post.author.username || "অজানা লেখক";
  const publishedDate = post.publishedAt ? formatBengaliDate(post.publishedAt) : "";
  const categoryName = post.category?.name || "গল্প";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/story/${post.slug}`} className="block h-full" prefetch>
        <div
          className={cn(
            "relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0b1120]/80 to-[#0f1629]/80 backdrop-blur-xl",
            "shadow-2xl shadow-black/20 transition-all duration-500",
            "hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10",
            "flex flex-col md:flex-row gap-6 p-6 md:p-8",
            "hover:-translate-y-1"
          )}
        >
          {/* IMAGE SECTION */}
          <div className="relative h-[180px] w-full md:h-[220px] md:w-[180px] flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-black">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 180px"
                priority={featured}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
                <span className="text-5xl opacity-40">📖</span>
              </div>
            )}
            {/* IMAGE OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* CONTENT SECTION */}
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            {/* TOP CONTENT */}
            <div className="space-y-4">
              {/* CATEGORY TAG */}
              <div className="inline-block">
                <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                  {categoryName}
                </span>
              </div>

              {/* TITLE */}
              <h3 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-white transition-colors duration-300 group-hover:text-orange-400 line-clamp-3">
                {post.title}
              </h3>

              {/* AUTHOR */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-300">{authorName}</span>
              </div>

              {/* DESCRIPTION/EXCERPT */}
              {post.description && (
                <p className="text-gray-400 leading-relaxed line-clamp-2">
                  {post.description}
                </p>
              )}
            </div>

            {/* BOTTOM METADATA */}
            <div className="flex flex-wrap items-center gap-6 pt-4 md:pt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays className="h-4 w-4 text-orange-500/70" />
                <span>{publishedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock3 className="h-4 w-4 text-orange-500/70" />
                <span>{formatBengaliNumber(post.readTime)} মিনিট</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
