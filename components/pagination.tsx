"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Pagination({
  offset,
  total,
}: {
  offset: number | null;
  total: number;
}) {
  const router = useRouter();
  const rowsPerPage = 5;

  const prevPage = () => {
    router.back();
  };

  const nextPage = () => {
    router.push(`?offset=${offset}`, { scroll: false });
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
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </CardFooter>
  );
}
