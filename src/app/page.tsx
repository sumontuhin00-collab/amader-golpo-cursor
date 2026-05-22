
import Footer from "@/components/footer/Footer";


import { HeroSection } from "@/components/home/hero-section";
import { StoryCard } from "@/components/story-card";
import { getFeaturedPosts, getTrendingPosts, getPublishedPosts, getCategories } from "@/lib/queries";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, trending, latest, categories] = await Promise.all([
    getFeaturedPosts(3),
    getTrendingPosts(6),
    getPublishedPosts({ limit: 6 }),
    getCategories(),
  ]);

  return (
    <>

      <HeroSection />

      {featured.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">বিশেষ গল্প</h2>
          </div>
          <div className="space-y-6">
            {featured.map((post, i) => (
              <StoryCard key={post.id} post={post} featured={i === 0} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">বিভাগসমূহ</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="glass rounded-xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <span className="font-medium">{cat.name}</span>
              <p className="text-xs text-muted-foreground mt-1">
                {cat._count.posts} গল্প
              </p>
            </Link>
          ))}
        </div>
      </section>

      {trending.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">জনপ্রিয়</h2>
          </div>
          <div className="space-y-6">
            {trending.map((post, i) => (
              <StoryCard key={post.id} post={post} index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-12 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">সর্বশেষ গল্প</h2>
          <Link href="/search">
            <Button variant="ghost" className="gap-1">
              সব দেখুন <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="space-y-6">
          {latest.posts.map((post, i) => (
            <StoryCard key={post.id} post={post} index={i} />
          ))}
        </div>
        
      </section>
      <Footer />
    </>
  );
}
