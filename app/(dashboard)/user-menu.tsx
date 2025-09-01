"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { toast } from "sonner";
import { Settings, LogOut, User as UserIcon } from "lucide-react";

function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full border-2 border-transparent hover:border-primary/20 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Image
            src={user?.image ?? "/placeholder-user.jpg"}
            width={32}
            height={32}
            alt="avatar"
            unoptimized
            className="overflow-hidden rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          Moje konto
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={"/settings"} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Ustawienia
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
            <form
              action={() => {
                signOut({
                  callbackUrl: "/sign-in",
                }).then(() => {
                  toast.success("Pomyślnie wylogowano Cię.");
                });
              }}
              className="flex items-center gap-2 w-full"
            >
              <LogOut className="h-4 w-4" />
              <button type="submit" className="text-left">
                Wyloguj się
              </button>
            </form>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/sign-in" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Zaloguj się
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
