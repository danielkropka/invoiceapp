"use client";

import React, { useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SearchClients() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  const handleSearch = (value: string) => {
    setSearchValue(value);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      params.delete("offset"); // Reset pagination when searching
      router.push(`/clients?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setSearchValue("");
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.delete("q");
      params.delete("offset");
      router.push(`/clients?${params.toString()}`);
    });
  };

  return (
    <div className="relative max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Wyszukaj klientów..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
          disabled={isPending}
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
            disabled={isPending}
          >
            <X className="w-3 h-3" />
            <span className="sr-only">Wyczyść wyszukiwanie</span>
          </Button>
        )}
      </div>
      {isPending && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
