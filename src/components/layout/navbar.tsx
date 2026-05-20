"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Menu,
  X,
  Sun,
  Moon,
  PenLine,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/search-bar";
import { NavProfileMenu } from "@/components/layout/nav-profile-menu";

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "হোম" },
    { href: "/categories", label: "বিভাগ" },
    { href: "/search", label: "অনুসন্ধান" },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <nav className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-gradient hidden sm:inline">আমাদের গল্প</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:block flex-1 max-w-md">
          <SearchBar compact />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="থিম পরিবর্তন"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {session ? (
            <>
              <Link href="/create" className="hidden sm:block">
                <Button size="sm" className="gap-1">
                  <PenLine className="h-4 w-4" />
                  লিখুন
                </Button>
              </Link>
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="icon" aria-label="ড্যাশবোর্ড">
                  <LayoutDashboard className="h-5 w-5" />
                </Button>
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="hidden sm:block">
                  <Button variant="ghost" size="icon" aria-label="অ্যাডমিন">
                    <Shield className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <NavProfileMenu />
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <LogIn className="h-4 w-4 mr-1" />
                  লগইন
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-1" />
                  নিবন্ধন
                </Button>
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="মেনু"
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t glass"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <SearchBar />
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              {session ? (
                <>
                  <Link href="/create" onClick={() => setMobileOpen(false)}>লিখুন</Link>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>ড্যাশবোর্ড</Link>
                  <Link
                    href={`/profile/${session.user.username}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    প্রোফাইল দেখুন
                  </Link>
                  <Link href="/profile/edit" onClick={() => setMobileOpen(false)}>
                    প্রোফাইল সম্পাদনা
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)}>অ্যাডমিন</Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 text-left text-destructive py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    লগআউট
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>লগইন</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>নিবন্ধন</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
