"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/icons";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      <div
        className={cn(
          "transition-opacity duration-300",
          ["/", "/clients"].includes(pathname) ? "opacity-100" : "opacity-0"
        )}
      >
        <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
        <Input
          name="q"
          type="search"
          placeholder="Wyszukaj po e-mail klienta..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      {isPending && <Spinner />}
    </form>
  );
}
