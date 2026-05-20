"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatBengaliNumber } from "@/lib/utils";
import { UserAvatarLink } from "@/components/profile/user-link";

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
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={featured ? "md:col-span-2 md:row-span-2" : ""}
    >
      <Link href={`/story/${post.slug}`} className="group block h-full" prefetch>
        <div className="glass rounded-2xl overflow-hidden h-full flex flex-col hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
          <div
            className={`relative overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-video"}`}
          >
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
              />
            ) : (
              <div className="absolute inset-0 gradient-hero flex items-center justify-center">
                <span className="text-4xl opacity-30">📖</span>
              </div>
            )}
            {post.category && (
              <Badge className="absolute top-3 left-3">{post.category.name}</Badge>
            )}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <h3
              className={`font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2 ${featured ? "text-2xl" : "text-lg"}`}
            >
              {post.title}
            </h3>
            {post.description && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                {post.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
              <div onClick={(e) => e.preventDefault()}>
                <UserAvatarLink
                  user={post.author}
                  size="sm"
                  showName
                  className="text-muted-foreground"
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime} মি
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {formatBengaliNumber(post._count.likes)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
