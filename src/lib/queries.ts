import { prisma } from "@/lib/db";
import { PostStatus, Prisma } from "@prisma/client";

const authorSelect = {
  id: true,
  name: true,
  username: true,
  image: true,
} as const;

const postInclude = {
  author: { select: authorSelect },
  category: { select: { id: true, name: true, slug: true } },
  _count: { select: { likes: true, comments: true } },
} satisfies Prisma.PostInclude;

export async function getPublishedPosts({
  limit = 12,
  page = 1,
  categorySlug,
  tag,
  search,
  sort = "latest",
}: {
  limit?: number;
  page?: number;
  categorySlug?: string;
  tag?: string;
  search?: string;
  sort?: "latest" | "popular";
} = {}) {
  const where: Prisma.PostWhereInput = {
    status: PostStatus.PUBLISHED,
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(tag && { tags: { has: tag } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const orderBy: Prisma.PostOrderByWithRelationInput[] =
    sort === "popular"
      ? [{ viewCount: "desc" }, { publishedAt: "desc" }]
      : [{ publishedAt: "desc" }];

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: postInclude,
      orderBy,
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, totalPages: Math.ceil(total / limit) };
}

export async function getFeaturedPosts(limit = 3) {
  return prisma.post.findMany({
    where: { status: PostStatus.PUBLISHED },
    include: postInclude,
    orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });
}

export async function getTrendingPosts(limit = 6) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      publishedAt: { gte: weekAgo },
    },
    include: postInclude,
    orderBy: [{ viewCount: "desc" }],
    take: limit,
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug, status: PostStatus.PUBLISHED },
    include: {
      ...postInclude,
      comments: {
        where: { parentId: null },
        include: {
          author: { select: authorSelect },
          replies: {
            include: {
              author: { select: authorSelect },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getRelatedPosts(postId: string, categoryId?: string | null, limit = 4) {
  return prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      id: { not: postId },
      ...(categoryId && { categoryId }),
    },
    include: postInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { posts: true } } },
  });
}

export async function getUserDashboard(userId: string) {
  const [posts, stats] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: userId },
      include: {
        category: { select: { name: true } },
        _count: { select: { likes: true, comments: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.post.groupBy({
      by: ["status"],
      where: { authorId: userId },
      _count: true,
    }),
  ]);

  const totalViews = await prisma.post.aggregate({
    where: { authorId: userId },
    _sum: { viewCount: true },
  });

  const totalLikes = await prisma.like.count({
    where: { post: { authorId: userId } },
  });

  return {
    posts,
    stats: {
      total: posts.length,
      published: stats.find((s) => s.status === "PUBLISHED")?._count ?? 0,
      drafts: stats.find((s) => s.status === "DRAFT")?._count ?? 0,
      views: totalViews._sum.viewCount ?? 0,
      likes: totalLikes,
    },
  };
}

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      role: true,
      createdAt: true,
      _count: { select: { posts: true, likes: true, bookmarks: true } },
    },
  });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          posts: { where: { status: PostStatus.PUBLISHED } },
        },
      },
    },
  });
}

export async function getUserPublishedPosts(username: string, limit = 24) {
  return prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      author: { username },
    },
    include: postInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getUserBookmarks(userId: string) {
  return prisma.bookmark.findMany({
    where: { userId },
    include: {
      post: {
        include: postInclude,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
