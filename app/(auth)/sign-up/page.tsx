"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerFormSchema } from "@/lib/validators/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export default function Page() {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
  });

  const [isPending, startTransition] = useTransition();

  const loginWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error(
        "Wystąpił błąd w trakcie tworzenia konta z pomocą Google. Spróbuj innej metody logowania."
      );
      console.log(error);
    }
  };

  const onSubmit = (data: z.infer<typeof registerFormSchema>) => {
    startTransition(async () => {
      try {
        await axios.post("/api/auth/create", data);

        toast.success("Pomyślnie stworzono konto.");
        signIn("credentials", { email: data.email, password: data.password });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.status === 302)
            return form.setError("email", {
              message: "Konto o podanym e-mailu już istnieje",
            });
        }
        toast.error("Wystąpił błąd w trakcie logowania.");
        console.log(error);
      }
    });
  };

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="md:mx-auto max-w-md w-full border rounded my-4 mx-3 p-6 h-fit bg-muted/40 shadow-xl space-y-4">
        <h2 className="text-center text-3xl font-semibold">
          Witaj w fakturly!
        </h2>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="example@fakturly.pl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasło</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Powtórz hasło</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" isLoading={isPending}>
              Rozpocznij fakturowanie
            </Button>
          </form>
        </Form>
        <div>
          <span className="text-sm text-muted-foreground">
            Masz już konto?{" "}
            <Link
              href={"/sign-in"}
              className="text-blue-500 hover:underline hover:cursor-pointer"
            >
              Zaloguj się
            </Link>
          </span>
        </div>
        <div className="relative flex items-center my-4">
          <span className="flex-grow border-muted-foreground border-t"></span>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 text-muted-foreground">lub</span>
          </div>
          <span className="flex-grow border-muted-foreground border-t"></span>
        </div>
        <Button
          className="w-full"
          variant={"outline"}
          onClick={loginWithGoogle}
          disabled={isPending}
        >
          <GoogleIcon className="w-5 h-5" />
        </Button>
      </div>
    </main>
  );
}
