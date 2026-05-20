// Dummy users data used for the profile cards demo
export type DemoUser = {
  id: string
  name: string
  bio: string
  avatar?: string
  followers: number
  following: number
  isFollowing?: boolean
  social?: {
    facebook?: string
    whatsapp?: string
    youtube?: string
    instagram?: string
  }
}

export const demoUsers: DemoUser[] = [
  {
    id: "u1",
    name: "রুমানা হাসান",
    bio: "গল্পকার ও অনুবাদক — ছোট গল্প ও অন্বেষণমূলক প্রবন্ধ লিখি।",
    avatar: "https://i.pravatar.cc/150?img=11",
    followers: 1240,
    following: 180,
    isFollowing: false,
    social: {
      facebook: "https://facebook.com/",
      whatsapp: "https://wa.me/+8801",
      youtube: "https://youtube.com/",
      instagram: "https://instagram.com/",
    },
  },
  {
    id: "u2",
    name: "জসিম উদ্দিন",
    bio: "কবিতা ও সাহিত্য গবেষণা। বাংলা কবিতার আধুনিক অধ্যাপক।",
    avatar: "https://i.pravatar.cc/150?img=12",
    followers: 980,
    following: 240,
    isFollowing: true,
    social: {
      facebook: "https://facebook.com/",
      youtube: "https://youtube.com/",
    },
  },
  {
    id: "u3",
    name: "সুমি পারভীন",
    bio: "রোমান্স গল্প ও উপন্যাসের লেখক।",
    avatar: "https://i.pravatar.cc/150?img=13",
    followers: 450,
    following: 90,
    isFollowing: false,
    social: {
      instagram: "https://instagram.com/",
      whatsapp: "https://wa.me/+8801",
    },
  },
  {
    id: "u4",
    name: "তাহির রহমান",
    bio: "নন-ফিকশন লেখক ও সম্পাদক।",
    avatar: "https://i.pravatar.cc/150?img=14",
    followers: 670,
    following: 130,
    isFollowing: false,
    social: {
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/",
    },
  },
]
