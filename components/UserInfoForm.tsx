"use client";

import { useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import axios from "axios";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Edit3,
  Eye,
  EyeOff,
} from "lucide-react";
import ProfilePictureUpload from "./ProfilePictureUpload";
import { userInfoFormSchema } from "@/lib/validators/validators";

type UserInfoFormData = z.infer<typeof userInfoFormSchema>;

interface UserInfoFormProps {
  initialData: {
    name?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    image?: string | null;
  };
  onSuccess?: () => void;
}

export default function UserInfoForm({
  initialData,
  onSuccess,
}: UserInfoFormProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  const form = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoFormSchema),
    defaultValues: {
      name: initialData.name || "",
      email: initialData.email || "",
      phoneNumber: initialData.phoneNumber || "",
      image: initialData.image || "",
    },
  });

  const [isPending, startTransition] = useTransition();

  // Monitorowanie zmian w formularzu
  const watchedValues = form.watch();

  const onSubmit = (data: UserInfoFormData) => {
    startTransition(async () => {
      try {
        // Prawdziwy API call
        const response = await axios.patch("/api/user", data);

        if (response.status === 200) {
          // Reset formularza z nowymi danymi
          form.reset(data);
          setHasChanges(false);

          toast.success("Pomyślnie zaktualizowano dane profilu!", {
            description:
              "Twoje informacje zostały zapisane i są teraz aktualne.",
          });

          // Odśwież stronę po zapisaniu danych
          setTimeout(() => {
            window.location.reload();
          }, 1000);

          onSuccess?.();
        } else {
          throw new Error("Failed to update user data");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            toast.error("Błąd walidacji danych", {
              description: error.response.data || "Sprawdź wprowadzone dane.",
            });
          } else if (error.response?.status === 401) {
            toast.error("Brak autoryzacji", {
              description: "Zaloguj się ponownie aby kontynuować.",
            });
          } else {
            toast.error("Wystąpił błąd podczas aktualizacji danych", {
              description:
                "Spróbuj ponownie za chwilę lub skontaktuj się z pomocą techniczną.",
            });
          }
        } else {
          toast.error("Wystąpił błąd podczas aktualizacji danych", {
            description:
              "Spróbuj ponownie za chwilę lub skontaktuj się z pomocą techniczną.",
          });
        }
      }
    });
  };

  const isFormValid = form.formState.isValid;
  const hasCompleteData = watchedValues.name && watchedValues.email;

  const handleImageChange = (imageUrl: string) => {
    form.setValue("image", imageUrl);
    setHasChanges(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Edycja danych profilu</CardTitle>
            <CardDescription>
              Zaktualizuj swoje podstawowe informacje
            </CardDescription>
          </div>
          {hasCompleteData && (
            <Badge
              variant="default"
              className="ml-auto bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Kompletne
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
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
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden field for image */}
            <input type="hidden" {...form.register("image")} />

            {/* Profile Picture Upload */}
            <div className="flex justify-center">
              <ProfilePictureUpload
                currentImage={initialData.image}
                userName={initialData.name}
                onImageChange={handleImageChange}
              />
            </div>

            <Separator />

            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Podstawowe informacje</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Imię i nazwisko *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="np. Jan Kowalski"
                          {...field}
                          className="h-11"
                          onChange={(e) => {
                            field.onChange(e);
                            setHasChanges(true);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Pełne imię i nazwisko</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Adres e-mail *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jan.kowalski@example.com"
                          {...field}
                          className="h-11"
                          onChange={(e) => {
                            field.onChange(e);
                            setHasChanges(true);
                          }}
                        />
                      </FormControl>
                      <FormDescription>Główny adres e-mail</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Contact Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Dane kontaktowe</h3>
                <Badge variant="outline" className="text-xs">
                  Opcjonalne
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Numer telefonu
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPhoneNumber ? "text" : "password"}
                            placeholder="+48 123 456 789"
                            {...field}
                            className="h-11 pr-10"
                            onChange={(e) => {
                              field.onChange(e);
                              setHasChanges(true);
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                          >
                            {showPhoneNumber ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Format międzynarodowy (opcjonalne)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
      </CardContent>
    </Card>
  );
}
