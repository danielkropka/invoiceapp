"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Palette, Mail, Monitor, Moon, Sun } from "lucide-react";

export default function AccountSettingsForm() {
  const { theme, setTheme } = useTheme();

  const [emailNotifications, setEmailNotifications] = useState({
    invoiceCreated: true,
    invoicePaid: true,
    invoiceOverdue: true,
    monthlyReport: false,
    securityAlerts: true,
  });

  const handleEmailNotificationChange = (
    key: keyof typeof emailNotifications
  ) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (themeName: string) => {
    switch (themeName) {
      case "light":
        return "Jasny";
      case "dark":
        return "Ciemny";
      default:
        return "Systemowy";
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="shadow-lg border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Powiadomienia e-mail</CardTitle>
              <CardDescription>
                Wybierz które powiadomienia chcesz otrzymywać
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Nowa faktura</Label>
                <p className="text-xs text-muted-foreground">
                  Otrzymuj powiadomienia o utworzeniu nowej faktury
                </p>
              </div>
              <Switch
                checked={emailNotifications.invoiceCreated}
                onCheckedChange={() =>
                  handleEmailNotificationChange("invoiceCreated")
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Faktura opłacona</Label>
                <p className="text-xs text-muted-foreground">
                  Powiadomienia o otrzymaniu płatności
                </p>
              </div>
              <Switch
                checked={emailNotifications.invoicePaid}
                onCheckedChange={() =>
                  handleEmailNotificationChange("invoicePaid")
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Faktura przeterminowana
                </Label>
                <p className="text-xs text-muted-foreground">
                  Ostrzeżenia o nieopłaconych fakturach
                </p>
              </div>
              <Switch
                checked={emailNotifications.invoiceOverdue}
                onCheckedChange={() =>
                  handleEmailNotificationChange("invoiceOverdue")
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Miesięczny raport</Label>
                <p className="text-xs text-muted-foreground">
                  Podsumowanie miesięcznej aktywności
                </p>
              </div>
              <Switch
                checked={emailNotifications.monthlyReport}
                onCheckedChange={() =>
                  handleEmailNotificationChange("monthlyReport")
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  Alerty bezpieczeństwa
                </Label>
                <p className="text-xs text-muted-foreground">
                  Ważne informacje o bezpieczeństwie konta
                </p>
              </div>
              <Switch
                checked={emailNotifications.securityAlerts}
                onCheckedChange={() =>
                  handleEmailNotificationChange("securityAlerts")
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="shadow-lg border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Motyw aplikacji</CardTitle>
              <CardDescription>
                Wybierz preferowany wygląd interfejsu
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {["light", "dark", "system"].map((themeName) => (
              <Button
                key={themeName}
                variant={theme === themeName ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleThemeChange(themeName)}
              >
                {getThemeIcon(themeName)}
                <span className="text-sm font-medium">
                  {getThemeLabel(themeName)}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
