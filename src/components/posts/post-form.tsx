"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { createPostAction, updatePostAction } from "@/actions/posts";
import { uploadCoverAction } from "@/actions/upload";
import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";

type Category = { id: string; name: string };

type PostFormProps = {
  categories: Category[];
  post?: {
    id: string;
    title: string;
    description?: string | null;
    content: string;
    coverImage?: string | null;
    categoryId?: string | null;
    tags: string[];
    status: "DRAFT" | "PUBLISHED";
  };
};

export function PostForm({ categories, post }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [categoryId, setCategoryId] = useState(post?.categoryId ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadCoverAction(fd);
    setUploading(false);
    if (result.error) toast.error(result.error);
    else if (result.url) {
      setCoverImage(result.url);
      toast.success("ছবি আপলোড হয়েছে");
    }
  }

  function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    startTransition(async () => {
      const form = document.getElementById("post-form") as HTMLFormElement;
      const formData = new FormData(form);
      formData.set("content", content);
      formData.set("coverImage", coverImage);
      formData.set("categoryId", categoryId);
      formData.set("status", status);

      const action = post
        ? updatePostAction.bind(null, post.id)
        : createPostAction;

      const result = await action({}, formData);
      if (result.error) toast.error(result.error);
      else if (result.success) {
        toast.success(status === "PUBLISHED" ? "প্রকাশিত!" : "খসড়া সংরক্ষিত!");
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  return (
    <form id="post-form" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">শিরোনাম *</Label>
        <Input
          id="title"
          name="title"
          defaultValue={post?.title}
          placeholder="আপনার গল্পের শিরোনাম"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">সংক্ষিপ্ত বিবরণ</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={post?.description ?? ""}
          placeholder="গল্পের সংক্ষিপ্ত পরিচয়"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>বিভাগ</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="বিভাগ নির্বাচন" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">ট্যাগ (কমা দিয়ে)</Label>
          <Input
            id="tags"
            name="tags"
            defaultValue={post?.tags?.join(", ") ?? ""}
            placeholder="গল্প, বাংলা, সাহিত্য"
          />
        </div>
      </div>

      <div
        className="space-y-2"
      >
        <Label>কভার ছবি</Label>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
              disabled={uploading}
            />
            <Button type="button" variant="outline" asChild>
              <span>
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ImagePlus className="h-4 w-4 mr-2" />
                )}
                ছবি আপলোড
              </span>
            </Button>
          </label>
          {coverImage && (
            <div className="relative w-32 h-20 rounded-lg overflow-hidden">
              <Image src={coverImage} alt="Cover" fill className="object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>বিষয়বস্তু *</Label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => handleSubmit("DRAFT")}
        >
          খসড়া সংরক্ষণ
        </Button>
        <Button
          type="button"
          disabled={isPending}
          onClick={() => handleSubmit("PUBLISHED")}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "প্রকাশ করুন"}
        </Button>
      </div>
    </form>
  );
}
