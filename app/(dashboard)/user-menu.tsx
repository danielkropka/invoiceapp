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

function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Image
            src={user?.image ?? "/placeholder-user.jpg"}
            width={36}
            height={36}
            alt="avatar"
            unoptimized={false}
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Moje konto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Ustawienia</DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem>
            <form
              action={() => {
                signOut({
                  callbackUrl: "/sign-in",
                }).then(() => {
                  toast.success("Pomyślnie wylogowano Cię.");
                });
              }}
            >
              <button type="submit">Wyloguj się</button>
            </form>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <Link href="/sign-in">Zaloguj się</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;
