import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getUserByUsername, getUserPublishedPosts } from "@/lib/queries";
import { PublicProfile } from "@/components/profile/public-profile";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await getUserByUsername(username);
  if (!profile) return { title: "প্রোফাইল পাওয়া যায়নি" };
  return {
    title: `${profile.name ?? profile.username} — প্রোফাইল`,
    description: profile.bio ?? `${profile.name ?? profile.username} এর আমাদের গল্প প্রোফাইল`,
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getUserByUsername(username);
  if (!profile?.username) notFound();

  const posts = await getUserPublishedPosts(username);

  return <PublicProfile profile={profile} posts={posts} />;
}
