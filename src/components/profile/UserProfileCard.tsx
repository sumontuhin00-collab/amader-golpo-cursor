"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { User, UserPlus, Check, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react"

type UserData = {
  id: string
  name: string
  bio: string
  avatar?: string
  followers: number
  following: number
  isFollowing?: boolean
}

// Profile card with follow/unfollow logic and animations
export default function UserProfileCard({ user }: { user: UserData }) {
  const [isFollowing, setIsFollowing] = useState(!!user.isFollowing)
  const [followers, setFollowers] = useState(user.followers)

  function toggleFollow() {
    if (isFollowing) {
      setIsFollowing(false)
      setFollowers((f) => Math.max(0, f - 1))
    } else {
      setIsFollowing(true)
      setFollowers((f) => f + 1)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/3 backdrop-blur-sm rounded-xl p-4 shadow-lg flex gap-4 items-center"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-xl text-orange-300 font-semibold">
        {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User />}
      </div>

      <div className="flex-1">
        <h5 className="font-semibold text-slate-100">{user.name}</h5>
        <p className="text-sm text-slate-300">{user.bio}</p>

        <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
          <div><strong className="text-slate-100">{followers}</strong> followers</div>
          <div><strong className="text-slate-100">{user.following}</strong> following</div>
        </div>

        {/* Social links */}
        <div className="mt-3 flex items-center gap-2">
          {user.social?.facebook && (
            <SocialLink href={user.social.facebook} label="Facebook"><Facebook className="w-4 h-4" /></SocialLink>
          )}
          {user.social?.whatsapp && (
            <SocialLink href={user.social.whatsapp} label="WhatsApp"><MessageCircle className="w-4 h-4" /></SocialLink>
          )}
          {user.social?.youtube && (
            <SocialLink href={user.social.youtube} label="YouTube"><Youtube className="w-4 h-4" /></SocialLink>
          )}
          {user.social?.instagram && (
            <SocialLink href={user.social.instagram} label="Instagram"><Instagram className="w-4 h-4" /></SocialLink>
          )}
        </div>
      </div>

      <motion.button
        onClick={toggleFollow}
        whileTap={{ scale: 0.97 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-all ${isFollowing ? "bg-amber-400 text-slate-900" : "bg-transparent border border-white/10 text-slate-100"}`}
        aria-pressed={isFollowing}
      >
        {isFollowing ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
        <span>{isFollowing ? "Following" : "Follow"}</span>
      </motion.button>
    </motion.article>
  )
}

function SocialLink({ href, children, label }: { href: string; children: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      className="p-2 rounded-md bg-white/3 text-orange-300 hover:drop-shadow-[0_6px_16px_rgba(249,115,22,0.18)] transition-all"
    >
      {children}
    </motion.a>
  )
}
