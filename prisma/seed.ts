import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123456", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@amadergolpo.com" },
    update: { username: "admin" },
    create: {
      email: "admin@amadergolpo.com",
      username: "admin",
      name: "অ্যাডমিন",
      password: hashedPassword,
      role: Role.ADMIN,
      bio: "আমাদের গল্প প্ল্যাটফর্মের প্রশাসক",
    },
  });

  // Backfill username for existing users (after migration)
  const { generateUniqueUsername } = await import("../src/lib/username");
  const allUsers = await prisma.user.findMany({ select: { id: true, name: true, email: true, username: true } });
  for (const u of allUsers) {
    if (!u.username) {
      const username = await generateUniqueUsername(u.name, u.email);
      await prisma.user.update({ where: { id: u.id }, data: { username } });
    }
  }

  const categories = [
    { name: "কবিতা", slug: "kobita", description: "বাংলা কবিতা ও ছন্দ" },
    { name: "গল্প", slug: "golpo", description: "ছোট ও দীর্ঘ গল্প" },
    { name: "উপন্যাস", slug: "uponnyas", description: "উপন্যাসের অধ্যায়" },
    { name: "ভ্রমণ", slug: "bhromon", description: "ভ্রমণ কাহিনী" },
    { name: "জীবনী", slug: "jiboni", description: "ব্যক্তিগত অভিজ্ঞতা" },
    { name: "দর্শন", slug: "dorshon", description: "চিন্তা ও দর্শন" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const golpoCategory = await prisma.category.findUnique({
    where: { slug: "golpo" },
  });

  if (golpoCategory) {
    await prisma.post.upsert({
      where: { slug: "prathom-golpo" },
      update: {},
      create: {
        title: "প্রথম গল্প — আমাদের যাত্রা",
        slug: "prathom-golpo",
        description:
          "একটি সুন্দর বাংলা গল্প যেখানে শব্দগুলো হৃদয়ে স্পর্শ করে।",
        content: `<h2>সূচনা</h2><p>এটি আমাদের গল্প প্ল্যাটফর্মের প্রথম নমুনা গল্প। এখানে আপনি আপনার হৃদয়ের কথা লিখতে পারবেন — কবিতা, গল্প, উপন্যাস, যা খুশি।</p><p>বাংলা ভাষায় লেখার সৌন্দর্য অপরিসীম। প্রতিটি শব্দ একটি ছবি, প্রতিটি বাক্য একটি অনুভূতি।</p><blockquote><p>“গল্প মানেই মানুষের হৃদয়ের আয়না।”</p></blockquote><p>আজ থেকে আপনিও এই যাত্রার অংশ। লিখুন, পড়ুন, ভাগ করুন।</p>`,
        status: "PUBLISHED",
        tags: ["গল্প", "বাংলা", "সাহিত্য"],
        readTime: 3,
        publishedAt: new Date(),
        authorId: admin.id,
        categoryId: golpoCategory.id,
      },
    });
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
