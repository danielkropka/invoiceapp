"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function Pagination({
  offset,
  total,
}: {
  offset: number | null;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rowsPerPage = 5;
  const [isPending, startTransition] = useTransition();

  // Konwertuj offset na liczbę jeśli jest stringiem
  const currentOffset = typeof offset === "string" ? parseInt(offset) : offset;

  const currentPage = currentOffset
    ? Math.floor(currentOffset / rowsPerPage) + 1
    : 1;
  const totalPages = Math.ceil(total / rowsPerPage);

  const prevPage = () => {
    const newOffset = Math.max(0, (currentOffset || 0) - rowsPerPage);
    const params = new URLSearchParams(searchParams);
    if (newOffset === 0) {
      params.delete("offset");
    } else {
      params.set("offset", newOffset.toString());
    }
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const nextPage = () => {
    const newOffset = (currentOffset || 0) + rowsPerPage;
    const params = new URLSearchParams(searchParams);
    params.set("offset", newOffset.toString());
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  // Pokaż paginację tylko jeśli są więcej niż 5 elementów
  if (total <= rowsPerPage) return null;

  return (
    <CardFooter className="border-t bg-muted/30 px-6 py-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Strona {currentPage} z {totalPages}
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">{total} faktur</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={prevPage}
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            className="gap-2 hover:bg-background transition-colors duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Poprzednia</span>
          </Button>

          <div className="flex items-center gap-1 px-3 py-1 bg-background rounded-md border">
            <span className="text-sm font-medium">{currentPage}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">{totalPages}</span>
          </div>

          <Button
            onClick={nextPage}
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            className="gap-2 hover:bg-background transition-colors duration-200"
          >
            <span className="hidden sm:inline">Następna</span>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </CardFooter>
  );
}
