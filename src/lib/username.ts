import { prisma } from "@/lib/db";

const USERNAME_REGEX = /^[a-z0-9][a-z0-9_-]{2,28}[a-z0-9]$/;

export function sanitizeUsernameBase(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "")
    .slice(0, 28);
}

export function isValidUsername(username: string): boolean {
  return USERNAME_REGEX.test(username);
}

export async function generateUniqueUsername(
  name?: string | null,
  email?: string
): Promise<string> {
  const base =
    sanitizeUsernameBase(name || "") ||
    sanitizeUsernameBase(email?.split("@")[0] || "") ||
    "user";

  let candidate = base.length >= 3 ? base : `${base}${Math.floor(Math.random() * 900 + 100)}`;
  if (!isValidUsername(candidate)) {
    candidate = `user${Date.now().toString(36).slice(-6)}`;
  }

  let attempt = 0;
  while (attempt < 20) {
    const exists = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
    attempt++;
    candidate = `${base.slice(0, 20)}${attempt}${Math.floor(Math.random() * 99)}`;
  }

  return `user${Date.now().toString(36)}`;
}

export async function ensureUserUsername(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { username: true, name: true, email: true },
  });
  if (!user) throw new Error("User not found");
  if (user.username) return user.username;

  const username = await generateUniqueUsername(user.name, user.email);
  await prisma.user.update({ where: { id: userId }, data: { username } });
  return username;
}
