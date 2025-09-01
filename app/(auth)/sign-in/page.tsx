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
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border/50 rounded-2xl shadow-2xl p-8 space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Witaj ponownie!
            </h1>
            <p className="text-muted-foreground text-sm">
              Zaloguj się do swojego konta, aby kontynuować
            </p>
          </div>

          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="example@fakturly.pl"
                          className="pl-10 h-11 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          {...field}
                        />
                      </div>
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
                    <FormLabel className="text-sm font-medium">Hasło</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••"
                          className="pl-10 pr-10 h-11 bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                isLoading={isPending}
              >
                {!isPending && <ArrowRight className="w-4 h-4 mr-2" />}
                Zaloguj się
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">
                lub
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            onClick={loginWithGoogle}
            disabled={isPending}
            className="w-full h-11 border-border/50 hover:bg-accent/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            Kontynuuj z Google
          </Button>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Nie masz konta?{" "}
              <Link
                href="/sign-up"
                className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors duration-200"
              >
                Stwórz konto
              </Link>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
