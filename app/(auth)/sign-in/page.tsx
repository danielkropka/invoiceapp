"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons";
import { signIn } from "next-auth/react";

export default function Page() {
  const loginWithGoogle = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="h-full max-w-2xl mx-auto mt-20 sm:w-[500px]">
      <div className="flex flex-col bg-muted/40 border items-center gap-2 p-4">
        <h1 className="text-2xl font-semibold">Witaj ponownie!</h1>
        <span className="text-muted-foreground">
          Zaloguj się za pomocą poniższych opcji
        </span>
        <Button className="gap-2" variant="outline" onClick={loginWithGoogle}>
          <GoogleIcon className="w-5 h-5" /> Kontynuuj z Google
        </Button>
      </div>
    </main>
  );
}
