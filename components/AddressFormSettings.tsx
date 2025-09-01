"use client";

import { Address } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addressFormSchema } from "@/lib/validators/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import axios from "axios";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Building,
  Hash,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit3,
} from "lucide-react";

export default function AddressFormSettings({
  address,
}: {
  address: Address | null;
}) {
  const [hasChanges, setHasChanges] = useState(false);

  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      street: address?.street || "",
      city: address?.city || "",
      postalCode: address?.postalCode || "",
      nip: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  // Monitorowanie zmian w formularzu
  const watchedValues = form.watch();
  const hasFormChanges = Object.keys(watchedValues).some(
    (key) =>
      watchedValues[key as keyof typeof watchedValues] !==
      (address?.[key as keyof Address] || "")
  );

  const onSubmit = (data: z.infer<typeof addressFormSchema>) => {
    startTransition(async () => {
      try {
        await axios.patch("/api/user", data);
        setHasChanges(false);
        toast.success("Pomyślnie zaaktualizowano dane rozliczeniowe!", {
          description:
            "Twoje dane zostały zapisane i będą widoczne na fakturach.",
        });
      } catch (error) {
        toast.error("Wystąpił błąd podczas aktualizacji danych", {
          description:
            "Spróbuj ponownie za chwilę lub skontaktuj się z pomocą techniczną.",
        });
      }
    });
  };

  const isFormValid = form.formState.isValid;
  const hasCompleteData =
    watchedValues.street && watchedValues.city && watchedValues.postalCode;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              hasCompleteData
                ? "bg-green-100 dark:bg-green-900/20"
                : "bg-amber-100 dark:bg-amber-900/20"
            }`}
          >
            {hasCompleteData ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div>
            <p className="font-medium">
              {hasCompleteData ? "Dane kompletne" : "Dane niekompletne"}
            </p>
            <p className="text-sm text-muted-foreground">
              {hasCompleteData
                ? "Wszystkie wymagane pola zostały wypełnione"
                : "Wypełnij wszystkie wymagane pola aby dokończyć konfigurację"}
            </p>
          </div>
        </div>
        {hasCompleteData && (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Gotowe
          </Badge>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Address Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Adres korespondencyjny</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Ulica i numer *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="np. ul. Przykładowa 123"
                        {...field}
                        className="h-11"
                        onChange={(e) => {
                          field.onChange(e);
                          setHasChanges(true);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Pełny adres z numerem domu/mieszkania
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Kod pocztowy *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00-000"
                        {...field}
                        className="h-11"
                        maxLength={6}
                        onChange={(e) => {
                          // Auto-formatowanie kodu pocztowego
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "-" + value.slice(2, 5);
                          }
                          field.onChange(value);
                          setHasChanges(true);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Format: 00-000</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Miejscowość *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="np. Warszawa"
                        {...field}
                        className="h-11"
                        onChange={(e) => {
                          field.onChange(e);
                          setHasChanges(true);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Nazwa miasta lub miejscowości
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Tax Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Dane podatkowe</h3>
              <Badge variant="outline" className="text-xs">
                Opcjonalne
              </Badge>
            </div>

            <FormField
              control={form.control}
              name="nip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Numer NIP
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234567890"
                      {...field}
                      className="h-11"
                      maxLength={10}
                      onChange={(e) => {
                        // Tylko cyfry dla NIP
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                        setHasChanges(true);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Numer Identyfikacji Podatkowej (10 cyfr)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {hasChanges && (
                <>
                  <Edit3 className="h-4 w-4" />
                  Masz niezapisane zmiany
                </>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setHasChanges(false);
                }}
                disabled={isPending || !hasChanges}
                className="h-11 px-6"
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                disabled={isPending || !isFormValid || !hasChanges}
                className="h-11 px-6"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Zapisz zmiany
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
