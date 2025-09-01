"use client";

import React, { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { invoiceFormSchema } from "@/lib/validators/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import moment from "moment";
import {
  CalendarIcon,
  PlusCircle,
  Receipt,
  User,
  Settings,
} from "lucide-react";
import Products from "./products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import "moment/locale/pl";
import ClientSelection from "./client-selection";
import { Client } from "@prisma/client";
import InvoicePreview from "./invoicePreview";
import { Checkbox } from "@/components/ui/checkbox";

export type invoiceType = z.infer<typeof invoiceFormSchema> & {
  client: Client;
};

function InvoiceCreatorForm({
  autoInvoiceId,
  clients,
}: {
  autoInvoiceId: string | null;
  clients: Client[];
}) {
  const currentDate = new Date();
  const form = useForm<invoiceType>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      products: [{}],
      invoiceId: autoInvoiceId || undefined,
    },
  });
  const router = useRouter();

  const { mutate: saveInvoice, isPending } = useMutation({
    mutationFn: async ({
      exemptTax,
      invoiceId,
      issuedAt,
      soldAt,
      products,
      clientId,
    }: invoiceType) => {
      return await axios.post("/api/invoice", {
        exemptTax,
        invoiceId,
        issuedAt,
        soldAt,
        products,
        clientId,
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.status === 400)
          return form.setError("invoiceId", {
            message: "Faktura o podanym numerze identyfikacyjnym już istnieje.",
          });
      }

      return toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Pomyślnie zapisano fakturę!");
      router.push("/");
      startTransition(() => {
        router.refresh();
      });
    },
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-muted/20 w-full max-w-full">
        <CardHeader className="pb-6 px-2 sm:px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-card-foreground">
                Tworzenie faktury
              </CardTitle>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Wypełnij wszystkie wymagane pola aby utworzyć nową fakturę
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-2 sm:px-4">
          <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => saveInvoice(data))}
                className="flex flex-col gap-4 xl:gap-6 w-full xl:w-3/5 min-w-0"
              >
                {/* Sekcja podstawowych danych */}
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <div className="p-2 bg-muted rounded-lg">
                      <Receipt className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">
                      Podstawowe dane
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <FormField
                      control={form.control}
                      name="invoiceId"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel className="text-sm font-medium text-foreground">
                            Numer faktury
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="h-11 border-input focus:border-ring focus:ring-ring"
                              placeholder="np. FV/2024/001"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="issuedAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Data wystawienia
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-11 pl-3 text-left font-normal border-input hover:border-ring hover:bg-accent",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    moment(field.value).format("LL")
                                  ) : (
                                    <span>Wybierz datę</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date("1900-01-01") ||
                                  date >
                                    new Date(
                                      `${currentDate.getFullYear()}-${
                                        currentDate.getMonth() + 2
                                      }-${currentDate.getDate()}`
                                    )
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="soldAt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Data sprzedaży
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-11 pl-3 text-left font-normal border-input hover:border-ring hover:bg-accent",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    moment(field.value).format("LL")
                                  ) : (
                                    <span>Wybierz datę</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date("1900-01-01") ||
                                  (form.watch("issuedAt")
                                    ? date > form.watch("issuedAt")
                                    : date > new Date())
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Sekcja szczegółów */}
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <div className="p-2 bg-muted rounded-lg">
                      <Settings className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">
                      Szczegóły
                    </h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="exemptTax"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium text-foreground cursor-pointer">
                            Podatnik zwolniony z VAT
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            Zaznacz jeśli klient jest zwolniony z podatku VAT
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sekcja danych klienta */}
                <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-border">
                    <div className="p-2 bg-muted rounded-lg">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground">
                      Dane klienta
                    </h3>
                  </div>

                  <ClientSelection clients={clients} form={form} />
                </div>

                {/* Sekcja produktów */}
                <div className="space-y-4 lg:space-y-6">
                  <Products form={form}>
                    <div className="pt-4 border-t border-border">
                      <Button
                        type="submit"
                        className="flex gap-2 items-center w-full lg:w-fit h-12 px-6 lg:px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                        isLoading={isPending}
                      >
                        <PlusCircle className="w-5 h-5" />
                        Zapisz fakturę
                      </Button>
                    </div>
                  </Products>
                </div>
              </form>
            </Form>

            <div className="w-full xl:w-2/5 min-w-0">
              <InvoicePreview
                formData={form.getValues()}
                client={clients.find(
                  (client) => client.id === form.watch("clientId")
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InvoiceCreatorForm;
