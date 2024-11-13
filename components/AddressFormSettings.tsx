"use client";

import { Address } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addressFormSchema } from "@/lib/validators/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { useTransition } from "react";
import { toast } from "sonner";

export default function AddressFormSettings({
  address,
}: {
  address: Address | null;
}) {
  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      street: address?.street,
      city: address?.city,
      postalCode: address?.postalCode,
    },
  });
  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: z.infer<typeof addressFormSchema>) => {
    startTransition(async () => {
      try {
        await axios.patch("/api/user", data);

        toast.success("Pomyślnie zaaktualizowano dane rozliczeniowe.");
      } catch (error) {
        if (error)
          toast.error(
            "Wystąpił błąd w trakcie aktualizowania danych rozliczeniowych."
          );
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ulica</FormLabel>
              <FormControl>
                <Input placeholder="Ulica" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miasto</FormLabel>
              <FormControl>
                <Input placeholder="Miasto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kod pocztowy</FormLabel>
              <FormControl>
                <Input placeholder="Kod pocztowy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIP</FormLabel>
              <FormControl>
                <Input placeholder="NIP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="col-span-full w-fit ml-auto" isLoading={isPending}>
          Zapisz zmiany
        </Button>
      </form>
    </Form>
  );
}
