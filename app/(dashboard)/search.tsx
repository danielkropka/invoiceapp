"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/icons";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  function searchAction(formData: FormData) {
    const value = formData.get("q") as string;
    const params = new URLSearchParams({ q: value });
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }

  function clearSearch() {
    startTransition(() => {
      router.replace(pathname);
    });
  }

  const isSearchable = ["/", "/clients"].includes(pathname);

  return (
    <form action={searchAction} className="relative">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isSearchable
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-95 translate-x-2 pointer-events-none"
        )}
      >
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            name="q"
            type="search"
            placeholder={
              pathname === "/clients"
                ? "Wyszukaj klienta..."
                : "Wyszukaj fakturę..."
            }
            className="w-full rounded-lg bg-background/50 border-border/50 pl-10 pr-10 md:w-[240px] lg:w-[320px] transition-all duration-200 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 opacity-0 group-focus-within:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Wyczyść wyszukiwanie</span>
          </Button>
        </div>
      </div>
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Spinner />
        </div>
      )}
    </form>
  );
}
