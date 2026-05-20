import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBengaliNumber } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  function buildUrl(page: number) {
    const params = new URLSearchParams({ ...searchParams, page: String(page) });
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      {currentPage > 1 ? (
        <Link href={buildUrl(currentPage - 1)}>
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
            আগের
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="h-4 w-4" />
          আগের
        </Button>
      )}
      <span className="text-sm text-muted-foreground">
        পৃষ্ঠা {formatBengaliNumber(currentPage)} / {formatBengaliNumber(totalPages)}
      </span>
      {currentPage < totalPages ? (
        <Link href={buildUrl(currentPage + 1)}>
          <Button variant="outline" size="sm">
            পরের
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="outline" size="sm" disabled>
          পরের
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
