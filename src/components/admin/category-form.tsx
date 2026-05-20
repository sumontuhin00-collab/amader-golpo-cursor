"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCategoryAction } from "@/actions/admin";

export function AdminCategoryForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createCategoryAction({}, formData);
      if (result.error) toast.error(result.error);
      else {
        toast.success("বিভাগ যোগ হয়েছে");
        (e.target as HTMLFormElement).reset();
        window.location.reload();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input name="name" placeholder="বিভাগের নাম" required className="flex-1" />
      <Button type="submit" size="sm" disabled={isPending}>
        যোগ করুন
      </Button>
    </form>
  );
}
