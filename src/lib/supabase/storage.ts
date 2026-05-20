import { createClient } from "@/lib/supabase/server";

const BUCKET = "uploads";

export async function uploadImage(
  file: File,
  folder: string
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
  if (!allowed.includes(ext)) {
    return { error: "শুধুমাত্র JPG, PNG, WebP, GIF অনুমোদিত" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "ফাইল ৫MB এর বেশি হতে পারবে না" };
  }

  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

  return { url: publicUrl };
}
