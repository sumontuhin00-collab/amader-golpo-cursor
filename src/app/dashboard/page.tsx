import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getUserDashboard } from "@/lib/queries";
import { formatBengaliNumber, formatBengaliDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PenLine, Eye, Heart, FileText, Edit, User } from "lucide-react";
import { getUserProfile } from "@/lib/queries";
import { DeletePostButton } from "@/components/posts/delete-post-button";
import { EmptyState } from "@/components/empty-state";

export const dynamic = "force-dynamic";
export const metadata = { title: "ড্যাশবোর্ড" };

export default async function DashboardPage() {
  const user = await requireAuth();
  const [profile, { posts, stats }] = await Promise.all([
    getUserProfile(user.id),
    getUserDashboard(user.id),
  ]);

  const statCards = [
    { label: "মোট গল্প", value: stats.total, icon: FileText },
    { label: "প্রকাশিত", value: stats.published, icon: PenLine },
    { label: "খসড়া", value: stats.drafts, icon: FileText },
    { label: "মোট দর্শন", value: stats.views, icon: Eye },
    { label: "মোট লাইক", value: stats.likes, icon: Heart },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">ড্যাশবোর্ড</h1>
          <p className="text-muted-foreground">স্বাগতম, {user.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile?.username && (
            <Link href={`/profile/${profile.username}`}>
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                প্রোফাইল দেখুন
              </Button>
            </Link>
          )}
          <Link href="/create">
            <Button className="gap-2">
              <PenLine className="h-4 w-4" />
              নতুন গল্প
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-xl p-4">
            <Icon className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{formatBengaliNumber(value)}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">আমার গল্পসমূহ</h2>
      {posts.length === 0 ? (
        <EmptyState
          title="এখনও কোনো গল্প নেই"
          description="আপনার প্রথম গল্প লিখে শুরু করুন"
          actionLabel="গল্প লিখুন"
          actionHref="/create"
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div
                  className="flex items-center gap-2 mb-1"
                >
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  <Badge variant={post.status === "PUBLISHED" ? "default" : "secondary"}>
                    {post.status === "PUBLISHED" ? "প্রকাশিত" : "খসড়া"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatBengaliDate(post.updatedAt)} · {post._count.likes} লাইক ·{" "}
                  {post._count.comments} মন্তব্য
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/edit/${post.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <DeletePostButton postId={post.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
