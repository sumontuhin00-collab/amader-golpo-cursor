import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { ensureUserUsername } from "@/lib/username";

export const dynamic = "force-dynamic";

/** Logged-in users visiting /profile are sent to their public profile. */
export default async function ProfileIndexPage() {
  const user = await requireAuth();
  const username = await ensureUserUsername(user.id);
  redirect(`/profile/${username}`);
}
