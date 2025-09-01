import AddressFormSettings from "@/components/AddressFormSettings";
import UserInfoForm from "@/components/UserInfoForm";
import PasswordChangeForm from "@/components/PasswordChangeForm";
import AccountSettingsForm from "@/components/AccountSettingsForm";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  CheckCircle,
  Settings as SettingsIcon,
} from "lucide-react";

export default async function Page() {
  const session = await getAuthSession();
  if (!session?.user) return redirect("/");

  const hasCompleteAddress =
    session.user.address?.street &&
    session.user.address?.city &&
    session.user.address?.postalCode;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Ustawienia</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Zarządzaj swoim kontem i preferencjami aplikacji
          </p>
        </div>

        {/* Main Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card className="shadow-lg border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Informacje profilowe
                    </CardTitle>
                    <CardDescription>
                      Zarządzaj swoimi podstawowymi danymi i zdjęciem profilowym
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Info Form */}
                <UserInfoForm
                  initialData={{
                    name: session.user.name,
                    email: session.user.email,
                    phoneNumber: null, // phoneNumber nie istnieje w typie użytkownika
                    image: session.user.image,
                  }}
                />
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="shadow-lg border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Dane rozliczeniowe
                    </CardTitle>
                    <CardDescription>
                      Dane które będą wyświetlane na każdej Twojej fakturze
                    </CardDescription>
                  </div>
                  {hasCompleteAddress && (
                    <Badge variant="default" className="ml-auto">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Kompletne
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <AddressFormSettings address={session.user.address} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Settings */}
          <div className="space-y-6">
            {/* Security Settings */}
            <PasswordChangeForm />

            {/* Account Settings */}
            <AccountSettingsForm />
          </div>
        </div>
      </div>
    </div>
  );
}
