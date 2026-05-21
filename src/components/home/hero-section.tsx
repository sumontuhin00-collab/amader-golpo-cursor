"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PenLine, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero py-20 md:py-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm mb-6"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            বাংলা সাহিত্যের নতুন ঠিকানা
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">আমাদের গল্প</span>
            <br />
            <span className="text-foreground/90">হৃদয়ের কথা লিখুন</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            কবিতা, গল্প, উপন্যাস — আপনার সৃজনশীলতাকে আমাদের প্ল্যাটফর্মে
            তুলে ধরুন। পড়ুন, লিখুন, অনুভব করুন।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <PenLine className="h-5 w-5" />
                লেখা শুরু করুন
              </Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                <BookOpen className="h-5 w-5" />
                গল্প পড়ুন
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
