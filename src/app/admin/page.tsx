import { requireAdmin } from "@/lib/auth";
import { getAdminStats } from "@/actions/admin";
import { prisma } from "@/lib/db";
import { formatBengaliNumber } from "@/lib/utils";
import { AdminCategoryForm } from "@/components/admin/category-form";
import { AdminUserActions } from "@/components/admin/user-actions";
import { AdminPostActions } from "@/components/admin/post-actions";
import { Users, FileText, MessageCircle, FolderOpen, Eye } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "অ্যাডমিন প্যানেল" };

export default async function AdminPage() {
  await requireAdmin();
  const stats = await getAdminStats();

  const [users, posts, categories] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { posts: true } },
      },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        author: { select: { name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  const statCards = [
    { label: "ব্যবহারকারী", value: stats.userCount, icon: Users },
    { label: "মোট গল্প", value: stats.postCount, icon: FileText },
    { label: "প্রকাশিত", value: stats.publishedCount, icon: FileText },
    { label: "মন্তব্য", value: stats.commentCount, icon: MessageCircle },
    { label: "বিভাগ", value: stats.categoryCount, icon: FolderOpen },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">অ্যাডমিন প্যানেল</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass rounded-xl p-4">
            <Icon className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{formatBengaliNumber(value)}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            শীর্ষ গল্প (দর্শন)
          </h2>
          <ul className="space-y-2">
            {stats.topPosts.map((p) => (
              <li key={p.id} className="flex justify-between text-sm">
                <span className="truncate flex-1">{p.title}</span>
                <span className="text-muted-foreground ml-2">
                  {formatBengaliNumber(p.viewCount)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">নতুন বিভাগ</h2>
          <AdminCategoryForm />
          <ul className="mt-4 space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center text-sm py-1 border-b border-border/50"
              >
                <span>
                  {cat.name} ({cat._count.posts})
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="glass rounded-2xl p-6 mb-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">ব্যবহারকারী পরিচালনা</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4">নাম</th>
              <th className="pb-2 pr-4">ইমেইল</th>
              <th className="pb-2 pr-4">ভূমিকা</th>
              <th className="pb-2 pr-4">গল্প</th>
              <th className="pb-2">কার্যক্রম</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border/30">
                <td className="py-3 pr-4">{user.name}</td>
                <td className="py-3 pr-4 text-muted-foreground">{user.email}</td>
                <td className="py-3 pr-4">{user.role}</td>
                <td className="py-3 pr-4">{user._count.posts}</td>
                <td className="py-3">
                  <AdminUserActions userId={user.id} role={user.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="glass rounded-2xl p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">গল্প পরিচালনা</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 pr-4">শিরোনাম</th>
              <th className="pb-2 pr-4">লেখক</th>
              <th className="pb-2 pr-4">অবস্থা</th>
              <th className="pb-2">কার্যক্রম</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border/30">
                <td className="py-3 pr-4 max-w-xs truncate">{post.title}</td>
                <td className="py-3 pr-4">{post.author.name}</td>
                <td className="py-3 pr-4">{post.status}</td>
                <td className="py-3">
                  <AdminPostActions postId={post.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
