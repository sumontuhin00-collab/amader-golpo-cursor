import Link from "next/link";
import { auth } from "@/auth";
import { formatBengaliDate, formatBengaliNumber } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/story-card";
import { EmptyState } from "@/components/empty-state";
import { Calendar, BookOpen, Pencil } from "lucide-react";

type PublicProfileProps = {
  profile: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
    bio: string | null;
    createdAt: Date;
    _count: { posts: number };
  };
  posts: Parameters<typeof StoryCard>[0]["post"][];
};

export async function PublicProfile({ profile, posts }: PublicProfileProps) {
  const session = await auth();
  const isOwner = session?.user?.id === profile.id;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="glass rounded-3xl overflow-hidden mb-10">
        <div className="h-32 md:h-40 gradient-hero relative" />
        <div className="px-6 pb-8 -mt-12 md:-mt-16 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl">
              <AvatarImage src={profile.image ?? undefined} />
              <AvatarFallback className="text-3xl">
                {profile.name?.[0] ?? profile.username?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold truncate">
                {profile.name ?? profile.username}
              </h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.bio && (
                <p className="mt-3 text-foreground/90 leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  যোগদান {formatBengaliDate(profile.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {formatBengaliNumber(profile._count.posts)}টি গল্প
                </span>
              </div>
            </div>
            {isOwner && (
              <Link href="/profile/edit" className="shrink-0">
                <Button variant="outline" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  প্রোফাইল সম্পাদনা
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6">
          {isOwner ? "আমার গল্প" : `${profile.name ?? profile.username} এর গল্প`}
        </h2>
        {posts.length === 0 ? (
          <EmptyState
            title="এখনও কোনো প্রকাশিত গল্প নেই"
            description={
              isOwner
                ? "আপনার প্রথম গল্প লিখে প্রকাশ করুন"
                : "এই লেখক এখনও কোনো গল্প প্রকাশ করেননি"
            }
            actionLabel={isOwner ? "গল্প লিখুন" : undefined}
            actionHref={isOwner ? "/create" : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <StoryCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
