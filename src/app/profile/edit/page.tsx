import { requireAuth } from "@/lib/auth";
import { getUserProfile } from "@/lib/queries";
import { ensureUserUsername } from "@/lib/username";
import { ProfileForm } from "@/components/profile/profile-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "প্রোফাইল সম্পাদনা" };

export default async function ProfileEditPage() {
  const user = await requireAuth();
  await ensureUserUsername(user.id);
  const profile = await getUserProfile(user.id);
  if (!profile) return null;

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-2xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">প্রোফাইল সম্পাদনা</h1>
        <Link href={`/profile/${profile.username}`}>
          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            প্রোফাইল দেখুন
          </Button>
        </Link>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
