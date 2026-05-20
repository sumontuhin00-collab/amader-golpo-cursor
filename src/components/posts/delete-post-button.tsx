"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deletePostAction } from "@/actions/posts";

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("আপনি কি এই গল্পটি মুছে ফেলতে চান?")) return;

    startTransition(async () => {
      const result = await deletePostAction(postId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("গল্প মুছে ফেলা হয়েছে");
        router.refresh();
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={handleDelete}
      disabled={isPending}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
