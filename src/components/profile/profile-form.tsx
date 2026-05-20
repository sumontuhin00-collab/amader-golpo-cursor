"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProfileAction, updateAvatarAction } from "@/actions/profile";
import { uploadAvatarAction } from "@/actions/upload";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";

type Profile = {
  id: string;
  username: string | null;
  name: string | null;
  email: string;
  image: string | null;
  bio: string | null;
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [avatar, setAvatar] = useState(profile.image ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadAvatarAction(fd);
    setUploading(false);
    if (result.error) toast.error(result.error);
    else if (result.url) {
      await updateAvatarAction(result.url);
      setAvatar(result.url);
      toast.success("প্রোফাইল ছবি আপডেট হয়েছে");
      router.refresh();
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfileAction({}, formData);
      if (result.error) toast.error(result.error);
      else if (result.fieldErrors) {
        const first = Object.values(result.fieldErrors)[0]?.[0];
        if (first) toast.error(first);
      } else if (result.success) {
        toast.success("প্রোফাইল আপডেট হয়েছে");
        const username = result.username ?? profile.username;
        router.push(`/profile/${username}`);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-6">
      <div className="space-y-2">
        <Label>প্রোফাইল ছবি</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
            {avatar ? (
              <Image src={avatar} alt="Avatar" fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-2xl">
                {profile.name?.[0] ?? "?"}
              </div>
            )}
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
            <Button type="button" variant="outline" asChild>
              <span>
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                ছবি আপলোড
              </span>
            </Button>
          </label>
        </div>
        <p className="text-xs text-muted-foreground">JPG, PNG, WebP — সর্বোচ্চ ৫MB</p>
      </div>

      <div
        className="space-y-2"
      >
        <Label htmlFor="name">নাম</Label>
        <Input id="name" name="name" defaultValue={profile.name ?? ""} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">ইউজারনেম</Label>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">@</span>
          <Input
            id="username"
            name="username"
            defaultValue={profile.username ?? ""}
            required
            pattern="[a-z0-9][a-z0-9_-]*[a-z0-9]|[a-z0-9]{3}"
            className="flex-1"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          আপনার পাবলিক প্রোফাইল: /profile/{profile.username}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">বায়ো</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio ?? ""}
          placeholder="আপনার সম্পর্কে লিখুন..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>ইমেইল</Label>
        <Input value={profile.email} disabled className="opacity-60" />
      </div>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "সংরক্ষণ করুন"}
      </Button>
    </form>
  );
}

