"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Home,
  Users2,
  FileText,
  Settings,
  BarChart3,
  Plus,
} from "lucide-react";
import React from "react";

export default function DashboardBreadCrumb() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  const convertPathNames = (path: string) => {
    if (path.length > 15) {
      return "Szczegóły faktury";
    }
    switch (path) {
      case "clients":
        return "Klienci";
      case "create":
        return "Kreator";
      case "settings":
        return "Ustawienia";
      case "analytics":
        return "Analityka";
      default:
        return path;
    }
  };

  const getPathIcon = (path: string) => {
    switch (path) {
      case "clients":
        return <Users2 className="h-3 w-3" />;
      case "create":
        return <Plus className="h-3 w-3" />;
      case "settings":
        return <Settings className="h-3 w-3" />;
      case "analytics":
        return <BarChart3 className="h-3 w-3" />;
      default:
        if (path.length > 15) {
          return <FileText className="h-3 w-3" />;
        }
        return null;
    }
  };

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={"/"}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <Home className="h-3 w-3" />
            Strona główna
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathNames.length !== 0 && <BreadcrumbSeparator />}
        {pathNames.map((path, index) => {
          const href = pathNames.slice(0, index + 1).join("/");
          const isLast = index === pathNames.length - 1;
          const icon = getPathIcon(path);

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/${href}`}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isLast
                      ? "text-foreground font-medium"
                      : "hover:text-primary"
                  }`}
                >
                  {icon}
                  {convertPathNames(path)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
