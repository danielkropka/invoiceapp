"use client";

import React from "react";
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
import { CalendarIcon, PlusCircle } from "lucide-react";
import Products from "./products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import "moment/locale/pl";
import ClientSelection from "./client-selection";
import { Client } from "@prisma/client";
import InvoicePreview from "./invoicePreview";

export type invoiceType = z.infer<typeof invoiceFormSchema> & {
  client: Client;
};

function InvoiceCreatorForm({
  autoInvoiceId,
  clients,
}: {
  autoInvoiceId: number | null;
  clients: Client[];
}) {
  const currentDate = new Date();
  const form = useForm<invoiceType>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      products: [{}],
      invoiceId: `${autoInvoiceId}-${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`,
    },
  });
  const router = useRouter();

  const { mutate: saveInvoice } = useMutation({
    mutationFn: async ({
      invoiceId,
      issuedAt,
      soldAt,
      products,
      clientId,
    }: invoiceType) => {
      return await axios.post("/api/invoice", {
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
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tworzenie faktury</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex lg:flex-row flex-col gap-12">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => saveInvoice(data))}
              className="flex flex-col gap-5 w-full lg:w-3/4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <span className="col-span-full text-2xl font-semibold">
                  Podstawowe dane
                </span>
                <FormField
                  control={form.control}
                  name="invoiceId"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Numer faktury</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Data wystawienia</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
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
                        <PopoverContent className="w-auto p-0" align="start">
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
                      <FormLabel>Data sprzedaży</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
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
                        <PopoverContent className="w-auto p-0" align="start">
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
                <span className="text-2xl font-semibold col-span-full">
                  Dane klienta
                </span>
                <ClientSelection clients={clients} form={form} />
                <span className="text-2xl font-semibold col-span-full">
                  Produkty
                </span>
                <Products form={form}>
                  <Button
                    type="submit"
                    className="flex gap-1 items-center w-full md:w-fit"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Zapisz fakturę
                  </Button>
                </Products>
              </div>
            </form>
          </Form>
          <InvoicePreview
            formData={form.getValues()}
            client={clients.find(
              (client) => client.id === form.watch("clientId")
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default InvoiceCreatorForm;
