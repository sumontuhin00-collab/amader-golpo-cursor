import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t glass mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-gradient">আমাদের গল্প</span>
            </Link>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              বাংলা সাহিত্য ও গল্পের একটি প্রিমিয়াম প্ল্যাটফর্ম। আপনার হৃদয়ের কথা
              লিখুন, পড়ুন এবং ভাগ করুন।
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">লিংক</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">হোম</Link></li>
              <li><Link href="/categories" className="hover:text-foreground transition-colors">বিভাগ</Link></li>
              <li><Link href="/search" className="hover:text-foreground transition-colors">অনুসন্ধান</Link></li>
              <li><Link href="/create" className="hover:text-foreground transition-colors">লিখুন</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">অ্যাকাউন্ট</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/login" className="hover:text-foreground transition-colors">লগইন</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">নিবন্ধন</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">ড্যাশবোর্ড</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} আমাদের গল্প। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            বাংলা ভাষায় তৈরি <Heart className="h-4 w-4 text-primary fill-primary" />
          </p>
        </div>
      </div>
    </footer>
  );
}
