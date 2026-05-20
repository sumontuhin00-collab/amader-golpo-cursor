"use client";

import { useEffect } from "react";
import { incrementViewAction } from "@/actions/posts";

export function ViewCounter({ postId }: { postId: string }) {
  useEffect(() => {
    incrementViewAction(postId);
  }, [postId]);

  return null;
}
