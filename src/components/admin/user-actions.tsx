"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateUserRoleAction, deleteUserAction } from "@/actions/admin";
import { Role } from "@prisma/client";
import { Trash2 } from "lucide-react";

export function AdminUserActions({
  userId,
  role,
}: {
  userId: string;
  role: Role;
}) {
  const [isPending, startTransition] = useTransition();

  function toggleRole() {
    const newRole = role === "ADMIN" ? Role.USER : Role.ADMIN;
    startTransition(async () => {
      const result = await updateUserRoleAction(userId, newRole);
      if (result.error) toast.error(result.error);
      else {
        toast.success("ভূমিকা আপডেট হয়েছে");
        window.location.reload();
      }
    });
  }

  function handleDelete() {
    if (!confirm("ব্যবহারকারী মুছে ফেলবেন?")) return;
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if (result.error) toast.error(result.error);
      else {
        toast.success("ব্যবহারকারী মুছে ফেলা হয়েছে");
        window.location.reload();
      }
    });
  }

  return (
    <div className="flex gap-1">
      <Button variant="outline" size="sm" onClick={toggleRole} disabled={isPending}>
        {role === "ADMIN" ? "USER" : "ADMIN"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-destructive"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
