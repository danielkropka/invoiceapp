"use client";

import React, { startTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { clientFormSchema } from "@/lib/validators/validators";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type clientType = z.infer<typeof clientFormSchema>;

function ClientCreatorForm() {
  const form = useForm<clientType>({
    resolver: zodResolver(clientFormSchema),
  });
  const router = useRouter();

  const { mutate: saveClient, isPending } = useMutation({
    mutationFn: async ({
      name,
      email,
      address,
      phoneNumber,
      taxIdNumber,
    }: clientType) => {
      const payload: clientType = {
        name,
        email,
        address,
        phoneNumber,
        taxIdNumber,
      };
      const { data } = await axios.post("/api/client", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.status === 400)
          return form.setError("email", {
            message: "Klient o podanym e-mailu już istnieje.",
          });
      }

      return toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Pomyślnie zapisano klienta!");
      router.push("/clients");
      startTransition(() => {
        router.refresh();
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tworzenie klienta</CardTitle>
        <CardDescription>
          Stworzenie klienta pozwoli usprawnić proces tworzenia faktury.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => saveClient(data))}
            className="flex flex-col gap-5 md:flex-row"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-2xl">
              <span className="col-span-full text-2xl font-semibold">
                Podstawowe dane
              </span>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nazwa klienta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="invoices@domain.pl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numer telefonu</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="123-456-789"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Te pole nie jest wymagane.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className="col-span-full text-2xl font-semibold">
                Szczegóły
              </span>
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Miejscowość</FormLabel>
                    <FormControl>
                      <Input placeholder="Miejscowość klienta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres</FormLabel>
                    <FormControl>
                      <Input placeholder="Adres klienta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kod pocztowy</FormLabel>
                    <FormControl>
                      <Input placeholder="Kod pocztowy klienta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxIdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIP</FormLabel>
                    <FormControl>
                      <Input placeholder="NIP klienta" {...field} />
                    </FormControl>
                    <FormDescription>
                      Te pole nie jest wymagane.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="md:self-end md:ml-auto"
              isLoading={isPending}
            >
              Zapisz klienta
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ClientCreatorForm;
