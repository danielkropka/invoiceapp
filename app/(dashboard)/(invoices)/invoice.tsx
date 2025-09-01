import React, { startTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { InvoiceType } from "@/types/db";
import moment from "moment";
import "moment/locale/pl";
import { Badge } from "@/components/ui/badge";
import { sumAllProducts } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function Invoice({ invoice, index }: { invoice: InvoiceType; index: number }) {
  let timeout: NodeJS.Timeout | undefined = undefined;
  const router = useRouter();

  const getStatusVariant = (status: string | null) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case "PAID":
        return "Zapłacono";
      case "PENDING":
        return "Wysłano";
      default:
        return "Niezapłacono";
    }
  };

  return (
    <TableRow className="hover:bg-muted/30 transition-colors duration-200 border-0">
      <TableCell className="font-medium py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {index + 1}
            </span>
          </div>
          <span className="font-mono text-sm">{invoice.invoiceId}</span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {invoice.client.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            {invoice.client.email}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <Badge
          variant="outline"
          className={cn(
            "capitalize border-2 font-medium",
            getStatusVariant(invoice.status)
          )}
        >
          {getStatusText(invoice.status)}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell py-4">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-lg">
            {sumAllProducts(invoice.products).toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground">PLN</span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {moment(invoice.issuedAt).format("DD.MM.YYYY")}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-haspopup="true"
              size="icon"
              variant="ghost"
              className="h-9 w-9 hover:bg-muted/80 transition-colors duration-200"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Otwórz menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={8}
            alignOffset={0}
            className="w-48"
          >
            <DropdownMenuLabel className="font-semibold">
              Akcje
            </DropdownMenuLabel>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                className="flex items-center gap-3 w-full"
                href={`/${invoice.id}`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Otwórz</span>
              </Link>
            </DropdownMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center gap-3 w-full text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Usuń</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Potwierdź usunięcie
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Tej operacji nie można cofnąć. Spowoduje ona trwałe
                    usunięcie faktury z naszych serwerów.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <DialogClose asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Anuluj
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={async () => {
                      if (timeout) return;
                      const t = toast.promise(
                        () => {
                          return new Promise((resolve) => {
                            timeout = setTimeout(async () => {
                              try {
                                await axios.delete("/api/invoice", {
                                  data: { id: invoice.id },
                                });
                                resolve("Success");
                                toast.dismiss(t);
                                toast.success("Pomyślnie usunięto fakturę.");
                              } catch (err) {
                                timeout = undefined;

                                toast.dismiss(t);
                                if (err instanceof AxiosError) {
                                  if (err.response?.status === 404) {
                                    return toast.info(
                                      "Faktura którą chcesz usunąć, nie istnieje."
                                    );
                                  }
                                }

                                return toast.error("Coś poszło nie tak.", {
                                  description:
                                    "Wystąpił błąd podczas usuwania faktury. Spróbuj ponownie później.",
                                });
                              }
                              startTransition(() => {
                                router.refresh();
                              });
                              timeout = undefined;
                            }, 5000);
                          });
                        },
                        {
                          success:
                            "Pomyślnie usunięto fakturę z Twojego konta.",
                          loading: "Trwa usuwanie faktury.",
                          action: {
                            label: "Cofnij",
                            onClick: () => {
                              clearTimeout(timeout);
                              timeout = undefined;
                            },
                          },
                        }
                      );
                    }}
                  >
                    Usuń fakturę
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default Invoice;
