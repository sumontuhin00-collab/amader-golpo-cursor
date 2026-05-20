import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type ProfileUser = {
  username: string | null;
  name?: string | null;
  image?: string | null;
};

export function profilePath(username: string | null | undefined) {
  if (!username) return "/profile";
  return `/profile/${username}`;
}

export function UserLink({
  user,
  className,
  children,
  noLink,
}: {
  user: ProfileUser;
  className?: string;
  children?: React.ReactNode;
  noLink?: boolean;
}) {
  if (!user.username) {
    return (
      <span className={className}>{children ?? user.name ?? "লেখক"}</span>
    );
  }
  if (noLink) {
    return (
      <span className={cn("hover:text-primary transition-colors", className)}>
        {children ?? user.name ?? `@${user.username}`}
      </span>
    );
  }

  return (
    <Link
      href={profilePath(user.username)}
      className={cn("hover:text-primary transition-colors", className)}
    >
      {children ?? user.name ?? `@${user.username}`}
    </Link>
  );
}

export function UserAvatarLink({
  user,
  size = "md",
  showName = false,
  className,
  noLink,
}: {
  user: ProfileUser;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
  noLink?: boolean;
}) {
  const sizeClass =
    size === "sm" ? "h-7 w-7" : size === "lg" ? "h-20 w-20" : "h-10 w-10";

  if (!user.username) {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <Avatar className={sizeClass}>
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback>{user.name?.[0] ?? "?"}</AvatarFallback>
        </Avatar>
        {showName && (
          <span className="text-sm font-medium">{user.name ?? "লেখক"}</span>
        )}
      </span>
    );
  }
  if (noLink) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 hover:opacity-80 transition-opacity",
          className
        )}
      >
        <Avatar className={sizeClass}>
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback>{user.name?.[0] ?? user.username[0]}</AvatarFallback>
        </Avatar>
        {showName && (
          <span className="text-sm font-medium">{user.name ?? user.username}</span>
        )}
      </span>
    );
  }

  return (
    <Link
      href={profilePath(user.username)}
      className={cn(
        "inline-flex items-center gap-2 hover:opacity-80 transition-opacity",
        className
      )}
    >
      <Avatar className={sizeClass}>
        <AvatarImage src={user.image ?? undefined} />
        <AvatarFallback>{user.name?.[0] ?? user.username[0]}</AvatarFallback>
      </Avatar>
      {showName && (
        <span className="text-sm font-medium">{user.name ?? user.username}</span>
      )}
    </Link>
  );
}
