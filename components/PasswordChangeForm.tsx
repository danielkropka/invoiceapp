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

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Key,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  Lock,
} from "lucide-react";

// Wzorzec dla silnego hasła: min 8 znaków, 1 wielka litera, 1 mała litera, 1 cyfra
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

const passwordChangeSchema = z
  .object({
    currentPassword: z
      .string({ required_error: "Aktualne hasło jest wymagane." })
      .min(1, "Aktualne hasło jest wymagane"),
    newPassword: z
      .string({ required_error: "Nowe hasło jest wymagane." })
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .max(128, "Hasło jest za długie")
      .regex(
        strongPasswordRegex,
        "Hasło musi zawierać co najmniej 8 znaków, w tym 1 wielką literę, 1 małą literę i 1 cyfrę"
      ),
    confirmPassword: z
      .string({ required_error: "Potwierdzenie hasła jest wymagane." })
      .min(8, "Potwierdzenie hasła musi mieć co najmniej 8 znaków")
      .max(128, "Potwierdzenie hasła jest za długie"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Hasła się różnią.",
    path: ["confirmPassword"],
  });

type PasswordChangeData = z.infer<typeof passwordChangeSchema>;

export default function PasswordChangeForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const form = useForm<PasswordChangeData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  // Monitorowanie zmian w formularzu
  const watchedValues = form.watch();
  const hasFormChanges = Object.values(watchedValues).some(
    (value) => value.length > 0
  );

  const onSubmit = (data: PasswordChangeData) => {
    startTransition(async () => {
      try {
        // Symulacja API call - w rzeczywistej aplikacji tutaj byłby prawdziwy endpoint
        await new Promise((resolve) => setTimeout(resolve, 2000));

        form.reset();
        setHasChanges(false);
        toast.success("Hasło zostało pomyślnie zmienione!", {
          description:
            "Twoje nowe hasło jest już aktywne. Pamiętaj o bezpiecznym przechowywaniu.",
        });
      } catch (error) {
        toast.error("Wystąpił błąd podczas zmiany hasła", {
          description: "Sprawdź aktualne hasło i spróbuj ponownie.",
        });
      }
    });
  };

  const isFormValid = form.formState.isValid;
  const newPassword = watchedValues.newPassword;
  const passwordStrength = newPassword
    ? {
        length: newPassword.length >= 8,
        uppercase: /[A-Z]/.test(newPassword),
        lowercase: /[a-z]/.test(newPassword),
        number: /\d/.test(newPassword),
      }
    : null;

  const getPasswordStrength = () => {
    if (!passwordStrength) return { score: 0, label: "", color: "" };

    const score = Object.values(passwordStrength).filter(Boolean).length;
    if (score <= 1) return { score, label: "Słabe", color: "text-red-500" };
    if (score <= 2) return { score, label: "Średnie", color: "text-amber-500" };
    if (score <= 3) return { score, label: "Dobre", color: "text-blue-500" };
    return { score, label: "Bardzo dobre", color: "text-green-500" };
  };

  const strength = getPasswordStrength();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Zmiana hasła</CardTitle>
            <CardDescription>
              Zaktualizuj swoje hasło aby zachować bezpieczeństwo konta
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Security Alert */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <strong className="text-amber-800 dark:text-amber-200">
              Wskazówki bezpieczeństwa:
            </strong>
            <p className="text-amber-700 dark:text-amber-300 mt-1">
              Używaj silnego hasła, które nie jest używane w innych serwisach.
              Zalecamy używanie menedżera haseł.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Aktualne hasło *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Wprowadź aktualne hasło"
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
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Wprowadź swoje aktualne hasło aby potwierdzić tożsamość
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* New Password */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Nowe hasło</h3>
              </div>

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Nowe hasło *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Wprowadź nowe hasło"
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
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Hasło musi mieć co najmniej 8 znaków, w tym wielką literę,
                      małą literę i cyfrę
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Strength Indicator */}
              {newPassword && passwordStrength && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Siła hasła:</span>
                    <Badge variant="outline" className={strength.color}>
                      {strength.label}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          passwordStrength.length
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          passwordStrength.length
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }
                      >
                        Co najmniej 8 znaków
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          passwordStrength.uppercase
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          passwordStrength.uppercase
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }
                      >
                        Wielka litera (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          passwordStrength.lowercase
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          passwordStrength.lowercase
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }
                      >
                        Mała litera (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          passwordStrength.number
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          passwordStrength.number
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }
                      >
                        Cyfra (0-9)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Potwierdź nowe hasło *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Potwierdź nowe hasło"
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Wprowadź ponownie nowe hasło aby potwierdzić
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {hasChanges && (
                  <>
                    <AlertCircle className="h-4 w-4" />
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
                      Zmienianie...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Zmień hasło
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
