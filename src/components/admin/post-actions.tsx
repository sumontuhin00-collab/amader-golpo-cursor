"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { adminDeletePostAction } from "@/actions/posts";
import { Trash2 } from "lucide-react";

export function AdminPostActions({ postId }: { postId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("গল্প মুছে ফেলবেন?")) return;
    startTransition(async () => {
      const result = await adminDeletePostAction(postId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("গল্প মুছে ফেলা হয়েছে");
        window.location.reload();
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  );
}
