"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UserAvatarLink, UserLink } from "@/components/profile/user-link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createCommentAction, deleteCommentAction } from "@/actions/comments";
import { formatBengaliDate } from "@/lib/utils";
import { Trash2, Reply } from "lucide-react";
import Link from "next/link";

type CommentAuthor = {
  id: string;
  username: string | null;
  name: string | null;
  image: string | null;
};

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  author: CommentAuthor;
  replies?: Comment[];
};

export function CommentSection({
  postId,
  comments: initialComments,
}: {
  postId: string;
  comments: Comment[];
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("postId", postId);
    if (replyTo) formData.set("parentId", replyTo);

    startTransition(async () => {
      const result = await createCommentAction({}, formData);
      if (result.error) toast.error(result.error);
      else {
        toast.success("মন্তব্য যোগ হয়েছে");
        setReplyTo(null);
        (e.target as HTMLFormElement).reset();
        window.location.reload();
      }
    });
  }

  function handleDelete(commentId: string) {
    startTransition(async () => {
      const result = await deleteCommentAction(commentId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("মন্তব্য মুছে ফেলা হয়েছে");
        setComments((prev) =>
          prev
            .filter((c) => c.id !== commentId)
            .map((c) => ({
              ...c,
              replies: (c.replies ?? []).filter((r) => r.id !== commentId),
            }))
        );
      }
    });
  }

  function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
    return (
      <div className={`${isReply ? "ml-8 mt-4" : "mt-4"} glass rounded-xl p-4`}>
        <div className="flex items-start gap-3">
          <UserAvatarLink user={comment.author} size="sm" />
          <div className="flex-1 min-w-0">
            <div
              className="flex items-center justify-between gap-2"
            >
              <UserLink user={comment.author} className="font-medium text-sm" />
              <span className="text-xs text-muted-foreground">
                {formatBengaliDate(comment.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed">{comment.content}</p>
            <div className="flex gap-2 mt-2">
              {session && !isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(comment.id)}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  উত্তর
                </Button>
              )}
              {session?.user?.id === comment.author.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDelete(comment.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
            {(comment.replies ?? []).map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">
        মন্তব্য ({comments.length})
      </h2>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <p className="text-sm text-muted-foreground mb-2">
              উত্তর দিচ্ছেন...
              <button
                type="button"
                className="ml-2 text-primary"
                onClick={() => setReplyTo(null)}
              >
                বাতিল
              </button>
            </p>
          )}
          <Textarea
            name="content"
            placeholder="আপনার মন্তব্য লিখুন..."
            rows={3}
            required
          />
          <Button type="submit" className="mt-2" disabled={isPending}>
            মন্তব্য করুন
          </Button>
        </form>
      ) : (
        <p className="text-muted-foreground mb-8">
          মন্তব্য করতে{" "}
          <Link href="/login" className="text-primary underline">
            লগইন
          </Link>{" "}
          করুন
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্য করুন!
        </p>
      ) : (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      )}
    </section>
  );
}
