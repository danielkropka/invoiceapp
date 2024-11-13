import AddressFormSettings from "@/components/AddressFormSettings";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await getAuthSession();
  if (!session?.user) return redirect("/");

  return (
    <main className="space-y-4 divide-y">
      <h2 className="text-2xl font-semibold pb-4">Ustawienia</h2>
      <div className="flex gap-10 py-6">
        <div className="flex flex-col">
          <span className="font-semibold">Dane rozliczeniowe</span>
          <span className="text-muted-foreground text-sm">
            Dane które, będą wyświetlane na każdej Twojej fakturze.
          </span>
        </div>
        <AddressFormSettings address={session.user.address} />
      </div>
      <div className="flex gap-10 py-6">
        <div className="flex flex-col">
          <span className="font-semibold">Zdjęcie profilowe</span>
          <span className="text-muted-foreground text-sm">
            Zmień swoje zdjęcie profilowe.
          </span>
        </div>
      </div>
    </main>
  );
}
