"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export default function DashboardBreadCrumb() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);
  const convertPathNames = (path: string) => {
    if (path.length > 10) {
      return "Szczegóły faktury";
    }
    switch (path) {
      case "clients":
        return "Klienci";
      case "create":
        return "Kreator";
      default:
        break;
    }
  };

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={"/"}>Strona główna</BreadcrumbLink>
        </BreadcrumbItem>
        {pathNames.length !== 0 && <BreadcrumbSeparator />}
        {pathNames.map((path, index) => {
          const href = pathNames.slice(0, index + 1).join("/");

          return (
            <React.Fragment key={index}>
              <BreadcrumbLink href={`/${href}`}>
                {convertPathNames(path)}
              </BreadcrumbLink>
              {pathNames.length !== index + 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
