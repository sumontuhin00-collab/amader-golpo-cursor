import Link from "next/link";
import { getCategories } from "@/lib/queries";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "বিভাগসমূহ" };

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">বিভাগসমূহ</h1>
      <p className="text-muted-foreground mb-10">
        আপনার পছন্দের বিষয় বেছে নিন
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="glass rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <BookOpen className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold mb-2">{cat.name}</h2>
            {cat.description && (
              <p className="text-muted-foreground text-sm mb-3">{cat.description}</p>
            )}
            <p className="text-sm text-primary">{cat._count.posts}টি গল্প</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
