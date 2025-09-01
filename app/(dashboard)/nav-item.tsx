"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";

const NavItem = ({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={clsx(
            "group flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 active:scale-95",
            {
              "bg-primary text-primary-foreground shadow-md": isActive,
              "text-muted-foreground hover:text-foreground hover:bg-accent":
                !isActive,
            }
          )}
        >
          <div
            className={clsx("transition-transform duration-200", {
              "scale-110": isActive,
              "group-hover:scale-105": !isActive,
            })}
          >
            {children}
          </div>
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="font-medium">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export default NavItem;
