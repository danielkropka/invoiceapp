"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginFormSchema } from "@/lib/validators/validators";
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
import { toast } from "sonner";

export default function Page() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const [isPending, startTransition] = useTransition();

  const loginWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data: z.infer<typeof loginFormSchema>) => {
    startTransition(async () => {
      try {
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          callbackUrl: "/",
        });

        toast.success("Pomyślnie zalogowano.");
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-200">
      <div className="mx-auto max-w-md w-full border rounded my-4 p-6 h-fit bg-muted/40 shadow-xl space-y-4">
        <h2 className="text-center text-3xl font-semibold">Witaj ponownie!</h2>
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
            <div className="space-y-1">
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
              {/* TODO <div className="text-right">
                <span className="text-sm text-muted-foreground hover:underline hover:cursor-pointer">
                  Zapomniałeś hasła?
                </span>
              </div> */}
            </div>

            <Button type="submit" className="w-full" isLoading={isPending}>
              Zaloguj się
            </Button>
          </form>
        </Form>
        <div>
          <span className="text-sm text-muted-foreground">
            Nie masz konta?{" "}
            <Link
              href={"/sign-up"}
              className="text-blue-500 hover:underline hover:cursor-pointer"
            >
              Stwórz konto
            </Link>
          </span>
        </div>
        <div className="relative flex items-center my-4">
          <span className="flex-grow border-muted-foreground border-t-2 border-dotted"></span>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 text-muted-foreground">lub</span>
          </div>
          <span className="flex-grow border-muted-foreground border-t-2 border-dotted"></span>
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
