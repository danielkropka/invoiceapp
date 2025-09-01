import React, { startTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Trash2,
  Mail,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Client as ClientType } from "@prisma/client";
import moment from "moment";
import "moment/locale/pl";
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
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

function Client({ client, index }: { client: ClientType; index: number }) {
  let timeout: NodeJS.Timeout | undefined = undefined;
  const router = useRouter();

  return (
    <TableRow className="hover:bg-muted/30 transition-colors duration-200 border-0">
      <TableCell className="font-medium py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {index + 1}
            </span>
          </div>
          <span className="font-semibold text-foreground">{client.name}</span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {client.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">{client.email}</span>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{client.address.city}</span>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {moment(client.createdAt).format("DD.MM.YYYY")}
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
                    usunięcie klienta z naszych serwerów.
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
                                await axios.delete("/api/client", {
                                  data: { id: client.id },
                                });
                                resolve("Success");
                                toast.dismiss(t);
                                toast.success("Pomyślnie usunięto klienta.");
                              } catch (err) {
                                timeout = undefined;

                                toast.dismiss(t);
                                if (err instanceof AxiosError) {
                                  if (err.response?.status === 404) {
                                    return toast.info(
                                      "Klient którego chcesz usunąć, nie istnieje."
                                    );
                                  }
                                }

                                return toast.error("Coś poszło nie tak.", {
                                  description:
                                    "Wystąpił błąd podczas usuwania klienta. Spróbuj ponownie później.",
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
                            "Pomyślnie usunięto klienta z Twojego konta.",
                          loading: "Trwa usuwanie klienta.",
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
                    Usuń klienta
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

export default Client;
