"use client";

import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import axios from "axios";
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
import { CalendarIcon, PlusCircle, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type invoiceType = z.infer<typeof invoiceFormSchema> & { clientId: string };

function InvoiceCreatorForm() {
  const form = useForm<invoiceType>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      products: [{}],
    },
  });

  const { mutate: saveInvoice } = useMutation({
    mutationFn: async ({
      invoiceId,
      status,
      paymentMethod,
      issuedAt,
      soldAt,
      products,
      clientId,
    }: invoiceType) => {
      return await axios.post("/api/create/invoice", {
        invoiceId,
        status,
        paymentMethod,
        issuedAt,
        soldAt,
        products,
        clientId,
      });
    },
  });

  const {
    fields: products,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "products",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tworzenie faktury</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => saveInvoice(data))}
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-2xl">
              <span className="col-span-full text-2xl font-semibold">
                Podstawowe dane
              </span>
              <FormField
                control={form.control}
                name="invoiceId"
                render={({ field }) => (
                  <FormItem>
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
                          disabled={(date) => date < new Date("1900-01-01")}
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
                          disabled={(date) => date < new Date("1900-01-01")}
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
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metoda płatności</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz metodę płatności" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CARD">Karta bankowa</SelectItem>
                        <SelectItem value="CASH">Gotówka</SelectItem>
                        <SelectItem value="BANK_TRANSFER">
                          Przelew bankowy
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PAID">Zapłacone</SelectItem>
                        <SelectItem value="PENDING">Oczekuje</SelectItem>
                        <SelectItem value="UNPAID">Niezapłacone</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <span className="text-2xl font-semibold">Produkty</span>
            <div>
              <Button
                type="button"
                className="gap-1"
                size={"sm"}
                onClick={() =>
                  append({ name: "", price: 0, quantity: 0, vat: "23" })
                }
                disabled={products.length > 9}
              >
                <PlusCircle className="w-4 h-4" /> Dodaj produkt
              </Button>
            </div>
            <div className="max-w-[308px] sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-6xl 2xl:max-w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">L.P.</TableHead>
                    <TableHead>Nazwa</TableHead>
                    <TableHead>Opis</TableHead>
                    <TableHead>Cena netto</TableHead>
                    <TableHead>Wartość netto</TableHead>
                    <TableHead>Stawka VAT</TableHead>
                    <TableHead>Kwota VAT</TableHead>
                    <TableHead>Wartość brutto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`products.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input className="w-[150px]" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`products.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input className="w-[150px]" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`products.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="w-[150px]"
                                  type="number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="netWorth"
                          className="w-[150px]"
                          type="number"
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`products.${index}.vat`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Wybierz VAT" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="23">23%</SelectItem>
                                  <SelectItem value="5">5%</SelectItem>
                                  <SelectItem value="3">3%</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="vatWorth"
                          className="w-[150px]"
                          type="number"
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          name="grossWorth"
                          className="w-[150px]"
                          type="number"
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant={"destructive"}
                          size={"icon"}
                          onClick={() => remove(index)}
                          disabled={products.length === 1}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default InvoiceCreatorForm;
