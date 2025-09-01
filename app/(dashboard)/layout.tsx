import React from "react";
import NavItem from "@/app/(dashboard)/nav-item";
import {
  Home,
  PanelLeft,
  Settings,
  Users2,
  FileText,
  BarChart3,
} from "lucide-react";
import Providers from "@/app/(dashboard)/providers";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import User from "@/app/(dashboard)/user";
import { SearchInput } from "@/app/(dashboard)/search";
import DashboardBreadCrumb from "./breadcrumb";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  if (!session?.user) return redirect("/sign-in");

  return (
    <Providers>
      <main className="flex flex-col h-screen w-full bg-gradient-to-br from-background to-muted/20 overflow-hidden">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-1 overflow-hidden">
          <header className="sticky top-0 z-30 flex h-12 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 shadow-sm">
            <MobileNav />
            <DashboardBreadCrumb />
            <div className="flex-1" />
            <SearchInput />
            <div className="flex items-center gap-2">
              <ModeToggle />
              <User />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto px-2 py-2 sm:px-4 sm:py-4 w-full">
            {children}
          </main>
        </div>
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:flex shadow-lg">
      <div className="flex h-16 items-center justify-center border-b">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <FileText className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
      <nav className="flex flex-col items-center gap-2 px-2 py-4">
        <NavItem href={"/"} label={"Strona główna"}>
          <Home className="w-5 h-5" />
        </NavItem>
        <NavItem href={"/clients"} label={"Klienci"}>
          <Users2 className="w-5 h-5" />
        </NavItem>
        <NavItem href={"/analytics"} label={"Analityka"}>
          <BarChart3 className="w-5 h-5" />
        </NavItem>
        <NavItem href={"/settings"} label={"Ustawienia"}>
          <Settings className="w-5 h-5" />
        </NavItem>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="sm:hidden hover:bg-accent transition-colors"
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Otwórz menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">Faktury</span>
        </div>
        <nav className="grid gap-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Home className="h-5 w-5" />
            Strona główna
          </Link>
          <Link
            href="/clients"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Users2 className="h-5 w-5" />
            Klienci
          </Link>
          <Link
            href="/analytics"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
            Analityka
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Settings className="h-5 w-5" />
            Ustawienia
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
