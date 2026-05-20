// Dummy users data used for the profile cards demo
export type DemoUser = {
  id: string
  name: string
  bio: string
  avatar?: string
  followers: number
  following: number
  isFollowing?: boolean
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
  },
  {
    id: "u2",
    name: "জসিম উদ্দিন",
    bio: "কবিতা ও সাহিত্য গবেষণা। বাংলা কবিতার আধুনিক অধ্যাপক।",
    avatar: "https://i.pravatar.cc/150?img=12",
    followers: 980,
    following: 240,
    isFollowing: true,
  },
  {
    id: "u3",
    name: "সুমি পারভীন",
    bio: "রোমান্স গল্প ও উপন্যাসের লেখক।",
    avatar: "https://i.pravatar.cc/150?img=13",
    followers: 450,
    following: 90,
    isFollowing: false,
  },
  {
    id: "u4",
    name: "তাহির রহমান",
    bio: "নন-ফিকশন লেখক ও সম্পাদক।",
    avatar: "https://i.pravatar.cc/150?img=14",
    followers: 670,
    following: 130,
    isFollowing: false,
  },
]
