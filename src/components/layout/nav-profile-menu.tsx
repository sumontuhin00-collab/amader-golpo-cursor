"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatarLink } from "@/components/profile/user-link";

export function NavProfileMenu() {
  const { data: session } = useSession();

  if (!session?.user?.username) return null;

  const profileHref = `/profile/${session.user.username}`;

  return (
    <>
      <Link href={profileHref} className="hidden sm:block">
        <Button variant="ghost" size="sm" className="gap-1">
          <User className="h-4 w-4" />
          প্রোফাইল
        </Button>
      </Link>
      <Link href="/profile/edit" className="hidden md:block">
        <Button variant="ghost" size="icon" aria-label="প্রোফাইল সম্পাদনা">
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <UserAvatarLink
        user={{
          username: session.user.username,
          name: session.user.name,
          image: session.user.image,
        }}
        size="sm"
      />
    </>
  );
}
