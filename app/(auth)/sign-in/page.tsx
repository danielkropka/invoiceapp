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
import { useRouter } from "next/navigation";

export default function Page() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const loginWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error(
        "Wystąpił błąd w trakcie logowania z pomocą konta Google. Spróbuj innej metody logowania."
      );
      console.log(error);
    }
  };

  const onSubmit = (data: z.infer<typeof loginFormSchema>) => {
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          if (result.error === "User not found")
            form.setError("email", {
              message: "Nieznaleziono konta o podanym e-mailu.",
            });
          else if (result.error === "User has no password")
            form.setError("email", {
              message: "Konto nie posiada przypisanego hasła",
            });
          else if (result.error === "Incorrect password")
            form.setError("password", { message: "Niepoprawne hasło" });

          throw new Error(result.error);
        } else if (result?.ok) {
          router.push("/");
          toast.success("Pomyślnie zalogowano.");
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="md:mx-auto max-w-md w-full border rounded my-4 mx-3 p-6 h-fit bg-muted/40 shadow-xl space-y-4">
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
