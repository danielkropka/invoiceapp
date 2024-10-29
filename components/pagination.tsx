"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Pagination({
  offset,
  total,
}: {
  offset: number | null;
  total: number;
}) {
  const router = useRouter();
  const rowsPerPage = 5;
  const [isPending, startTransition] = useTransition();

  const prevPage = () => {
    router.back();
  };

  const nextPage = () => {
    startTransition(() => {
      router.push(`?offset=${offset}`, { scroll: false });
    });
  };

  return (
    <CardFooter>
      {offset && offset !== 0 ? (
        <div className="flex w-full justify-between md:justify-normal">
          <Button
            onClick={prevPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset === rowsPerPage}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Poprzednia
          </Button>
          <Button
            onClick={nextPage}
            variant="ghost"
            size="sm"
            type="submit"
            disabled={offset >= total}
          >
            Następna
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin ml-2" />
            ) : (
              <ChevronRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      ) : null}
    </CardFooter>
  );
}
