"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Heart, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLikeAction, toggleBookmarkAction } from "@/actions/posts";
import { formatBengaliNumber } from "@/lib/utils";

export function StoryActions({
  postId,
  slug,
  title,
  initialLiked,
  initialBookmarked,
  likeCount,
}: {
  postId: string;
  slug: string;
  title: string;
  initialLiked: boolean;
  initialBookmarked: boolean;
  likeCount: number;
}) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [likes, setLikes] = useState(likeCount);
  const [isPending, startTransition] = useTransition();

  function handleLike() {
    if (!session) {
      toast.error("লাইক করতে লগইন করুন");
      return;
    }
    startTransition(async () => {
      const result = await toggleLikeAction(postId);
      setLiked(result.liked);
      setLikes((prev) => (result.liked ? prev + 1 : prev - 1));
    });
  }

  function handleBookmark() {
    if (!session) {
      toast.error("বুকমার্ক করতে লগইন করুন");
      return;
    }
    startTransition(async () => {
      const result = await toggleBookmarkAction(postId);
      setBookmarked(result.bookmarked);
      toast.success(result.bookmarked ? "বুকমার্ক করা হয়েছে" : "বুকমার্ক সরানো হয়েছে");
    });
  }

  async function handleShare() {
    const url = `${window.location.origin}/story/${slug}`;
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("লিংক কপি হয়েছে");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={liked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        disabled={isPending}
      >
        <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
        {formatBengaliNumber(likes)}
      </Button>
      <Button
        variant={bookmarked ? "default" : "outline"}
        size="sm"
        onClick={handleBookmark}
        disabled={isPending}
      >
        <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
