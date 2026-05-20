"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSort(sort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <SearchBar />
      </div>
      <Select
        value={searchParams.get("sort") ?? "latest"}
        onValueChange={updateSort}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="সাজান" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">সর্বশেষ</SelectItem>
          <SelectItem value="popular">জনপ্রিয়</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
