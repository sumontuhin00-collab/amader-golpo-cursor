"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react"

// Footer component for "আমাদের গল্প"
export default function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    // Simulate subscription success
    setSubscribed(true)
    setTimeout(() => setEmail(""), 400)
  }

  return (
    <footer className="mt-12 bg-gradient-to-b from-[#0b0f14] to-[#071017] text-slate-100">
      {/* Gradient top border */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 rounded-t-md" />

      <div className="max-w-7xl mx-auto p-8 md:p-12 lg:p-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-slate-900 font-bold shadow-lg">
                গল্প
              </div>
              <div>
                <h3 className="text-2xl font-semibold">আমাদের গল্প</h3>
                <p className="text-sm text-orange-300">বাংলা সাহিত্যের নতুন ঠিকানা</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm max-w-sm bg-white/5 p-4 rounded-lg backdrop-blur-sm">
              আমাদের গল্প একটি ডিজিটাল কেন্দ্র যেখানে লেখক ও পাঠক মিলিত হয়ে বাংলা সাহিত্যের নতুন কাহিনি গড়েন। গল্প, কবিতা, উপন্যাস ও প্রবন্ধের জন্য বন্ধুত্বপূর্ণ পরিবেশ।
            </p>

            <div className="rounded-3xl bg-white/5 p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Follow us</p>
                  <p className="text-xs text-slate-400">সোশ্যাল মিডিয়ায় আমাদের সাথে যুক্ত থাকুন</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <SocialIcon href="https://www.facebook.com/share/1HiFepG1cQ/" label="Facebook">
                  <Facebook />
                </SocialIcon>
                <SocialIcon href="https://wa.me/qr/HFUHHS7VYOLIE1" label="WhatsApp">
                  <MessageCircle />
                </SocialIcon>
                <SocialIcon href="https://youtube.com/@cozy_minds01?si=i1bCnC6goaoDoifJ" label="YouTube">
                  <Youtube />
                </SocialIcon>
                <SocialIcon href="https://www.instagram.com/m.sumon_07?igsh=MWdqMW9iamRlaG1oYQ==" label="Instagram">
                  <Instagram />
                </SocialIcon>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <nav className="md:col-span-1 flex flex-col space-y-2">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-1 text-slate-300">
              <li><FooterLink href="#">হোম</FooterLink></li>
              <li><FooterLink href="#">গল্প</FooterLink></li>
              <li><FooterLink href="#">কবিতা</FooterLink></li>
              <li><FooterLink href="#">লেখক</FooterLink></li>
              <li><FooterLink href="#">জনপ্রিয়</FooterLink></li>
              <li><FooterLink href="#">যোগাযোগ</FooterLink></li>
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold">নিউজলেটার</h4>
            <p className="text-sm text-slate-300 mb-3">নতুন লেখাগুলো ইমেইলে পেতে সাবস্ক্রাইব করুন।</p>

            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="আপনার ইমেইল লিখুন"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-l-md bg-white/5 placeholder-slate-400 text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-label="Email subscription"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-4 py-2 rounded-r-md bg-gradient-to-br from-orange-400 to-amber-400 text-slate-900 font-semibold shadow-md"
              >
                {subscribed ? "ধন্যবাদ" : "Subscribe"}
              </motion.button>
            </form>

            <p className="text-xs text-slate-400 mt-2">আপনার তথ্য নিরাপদ থাকবে।</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">© 2026 আমাদের গল্প — All rights reserved.</p>
          <p className="text-sm text-slate-300">Made by <span aria-hidden>SUMON</span> in Bangladesh</p>
        </div>
      </div>
    </footer>
  )
}

// Small reusable footer link
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-block text-slate-300 hover:text-orange-300 transition-colors"
    >
      {children}
    </a>
  )
}

// Social icon wrapper with hover glow and scale
function SocialIcon({ href, children, label }: { href: string; children: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      className="p-2 rounded-full bg-white/2 text-orange-300 hover:drop-shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all"
    >
      <span className="sr-only">{label}</span>
      <div className="w-6 h-6">{children}</div>
    </motion.a>
  )
}
