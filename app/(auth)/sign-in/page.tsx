"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Page() {
  const loginWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex h-screen">
      <div className="max-w-4xl w-full flex items-center justify-center bg-background ">
        <div className="bg-muted/40 border max-w-md w-full p-6 rounded shadow dark:border-slate-700">
          <h2 className="font-semibold text-2xl text-center">
            Generator faktur
          </h2>
          <p className="text-center text-sm text-muted-foreground pb-4 border-b">
            Zaloguj się do aplikacji z użyciem poniższych opcji.
          </p>
          <Button
            className="flex gap-1 mx-auto mt-3"
            variant={"outline"}
            onClick={loginWithGoogle}
          >
            <GoogleIcon className="w-5 h-5" />
            Kontynuuj z Google
          </Button>
        </div>
      </div>
      <div className="w-full max-w-6xl h-full bg-gradient-to-br from-slate-200 dark:from-slate-900 border-l overflow-hidden relative rounded-l-[5rem] hidden lg:block">
        <h1 className="absolute top-12 left-12 font-semibold text-3xl">
          Twórz faktury szybko i bez stresu
        </h1>
        <h3 className="text-lg text-muted-foreground top-24 left-12 absolute">
          Fakturowanie w kilka kliknięć. Oszczędność czasu i mniej stresu.
        </h3>
        <div className="-rotate-[14deg]">
          <Image
            className="top-[30rem] left-48 absolute scale-[1.9] xl:top-[21rem] xl:left-44 xl:scale-[1.4] rounded dark:border"
            src="/login-bg.png"
            alt="background image"
            width={1920}
            height={1080}
            unoptimized={false}
            priority
          />
        </div>
      </div>
    </main>
  );
}
