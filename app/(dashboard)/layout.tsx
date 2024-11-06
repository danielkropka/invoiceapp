import React from "react";
import NavItem from "@/app/(dashboard)/nav-item";
import { Bell, Home, PanelLeft, Settings, Users2 } from "lucide-react";
import Providers from "@/app/(dashboard)/providers";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import User from "@/app/(dashboard)/user";
import { SearchInput } from "@/app/(dashboard)/search";
import DashboardBreadCrumb from "./breadcrumb";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { Notification } from "@prisma/client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (!session?.user) return redirect("/sign-in");

  const CountUnreadNotify = (notifications: Notification[]) => {
    let total = 0;
    notifications.forEach((notification) => {
      total += !notification.read ? 1 : 0;
    });

    return total;
  };

  return (
    <Providers>
      <main className="flex flex-col min-h-screen w-full bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <DashboardBreadCrumb />
            <SearchInput />
            <User />
            <span className="relative inline-flex">
              <Link
                className={cn(
                  buttonVariants({ size: "icon", variant: "outline" })
                )}
                href={"/notifications"}
              >
                <Bell className="w-5 h-5" />
              </Link>
              {CountUnreadNotify(session.user.notifications) > 0 ? (
                <span className="absolute flex h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
              ) : null}
            </span>

            <ModeToggle />
          </header>
          <main className="grid flex-1 items-start gap-2 px-4 py-2 sm:px-6 sm:py-2 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem href={"/"} label={"Strona główna"}>
          <Home className="w-5 h-5" />
        </NavItem>

        <NavItem href={"/clients"} label={"Klienci"}>
          <Users2 className="w-5 h-5" />
        </NavItem>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Strona główna
          </Link>

          <Link
            href="/clients"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Users2 className="h-5 w-5" />
            Klienci
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            Ustawienia
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
