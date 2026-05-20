"use client"
import React from "react"
import Footer from "@/components/footer/Footer"
import UserProfileCard from "@/components/profile/UserProfileCard"
import { demoUsers } from "@/lib/dummy-users"

export default function FooterDemoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#071017] to-[#03060a] text-slate-100">
      <div className="max-w-5xl mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">আমাদের গল্প — Demo</h1>
          <p className="text-slate-300">Footer and User Profile Card components demonstration.</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {demoUsers.map((u) => (
            <UserProfileCard key={u.id} user={u} />
          ))}
        </section>
      </div>

      <Footer />
    </main>
  )
}
