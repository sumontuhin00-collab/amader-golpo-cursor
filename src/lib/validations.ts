import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর"),
    email: z.string().email("সঠিক ইমেইল দিন"),
    password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });

export const usernameSchema = z
  .string()
  .min(3, "ইউজারনেম কমপক্ষে ৩ অক্ষর")
  .max(30, "ইউজারনেম ৩০ অক্ষরের বেশি হতে পারবে না")
  .regex(
    /^[a-z0-9][a-z0-9_-]*[a-z0-9]$|^[a-z0-9]{3}$/,
    "শুধু ছোট হাতের ইংরেজি অক্ষর, সংখ্যা, _ ও -"
  );

export const profileSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর"),
  username: usernameSchema,
  bio: z.string().max(500, "বায়ো ৫০০ অক্ষরের বেশি হতে পারবে না").optional(),
});

export const postSchema = z.object({
  title: z.string().min(3, "শিরোনাম কমপক্ষে ৩ অক্ষর"),
  description: z.string().max(300).optional(),
  content: z.string().min(10, "বিষয়বস্তু কমপক্ষে ১০ অক্ষর"),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export const commentSchema = z.object({
  content: z.string().min(1, "মন্তব্য লিখুন").max(2000),
  postId: z.string(),
  parentId: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর"),
  description: z.string().max(200).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
