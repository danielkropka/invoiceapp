"use client";

import React, { startTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { clientFormSchema } from "@/lib/validators/validators";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, MapPin, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type clientType = z.infer<typeof clientFormSchema>;

// Lista krajów - najpopularniejsze kraje na początku
const countries = [
  "Polska",
  "Niemcy",
  "Francja",
  "Wielka Brytania",
  "Stany Zjednoczone",
  "Kanada",
  "Australia",
  "Włochy",
  "Hiszpania",
  "Holandia",
  "Belgia",
  "Austria",
  "Szwajcaria",
  "Szwecja",
  "Norwegia",
  "Dania",
  "Finlandia",
  "Czechy",
  "Słowacja",
  "Węgry",
  "Rumunia",
  "Bułgaria",
  "Chorwacja",
  "Słowenia",
  "Litwa",
  "Łotwa",
  "Estonia",
  "Portugalia",
  "Grecja",
  "Cypr",
  "Malta",
  "Irlandia",
  "Luksemburg",
  "Japonia",
  "Korea Południowa",
  "Chiny",
  "Indie",
  "Brazylia",
  "Argentyna",
  "Meksyk",
  "Chile",
  "Kolumbia",
  "Peru",
  "Urugwaj",
  "Paragwaj",
  "Boliwia",
  "Ekwador",
  "Wenezuela",
  "Gujana",
  "Surinam",
  "Gujana Francuska",
  "Rosja",
  "Ukraina",
  "Białoruś",
  "Moldawia",
  "Gruzja",
  "Armenia",
  "Azerbejdżan",
  "Kazachstan",
  "Uzbekistan",
  "Kirgistan",
  "Tadżykistan",
  "Turkmenistan",
  "Mongolia",
  "Chiny",
  "Tajwan",
  "Hongkong",
  "Makau",
  "Singapur",
  "Malezja",
  "Tajlandia",
  "Wietnam",
  "Kambodża",
  "Laos",
  "Mjanma",
  "Filipiny",
  "Indonezja",
  "Brunei",
  "Timor Wschodni",
  "Papua-Nowa Gwinea",
  "Fidżi",
  "Vanuatu",
  "Wyspy Salomona",
  "Palau",
  "Mikronezja",
  "Marshall",
  "Kiribati",
  "Tuvalu",
  "Nauru",
  "Samoa",
  "Tonga",
  "Nowa Zelandia",
  "RPA",
  "Egipt",
  "Libia",
  "Tunezja",
  "Algieria",
  "Maroko",
  "Sudan",
  "Etiopia",
  "Kenia",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Burundi",
  "Demokratyczna Republika Konga",
  "Republika Konga",
  "Republika Środkowoafrykańska",
  "Czad",
  "Niger",
  "Nigeria",
  "Benin",
  "Togo",
  "Ghana",
  "Burkina Faso",
  "Mali",
  "Senegal",
  "Gambia",
  "Gwinea Bissau",
  "Gwinea",
  "Sierra Leone",
  "Liberia",
  "Wybrzeże Kości Słoniowej",
  "Mauretania",
  "Mali",
  "Burkina Faso",
  "Niger",
  "Nigeria",
  "Kamerun",
  "Republika Środkowoafrykańska",
  "Czad",
  "Sudan",
  "Etiopia",
  "Erytrea",
  "Dżibuti",
  "Somalia",
  "Kenia",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Burundi",
  "Demokratyczna Republika Konga",
  "Republika Konga",
  "Gabon",
  "Gwinea Równikowa",
  "Wyspy Świętego Tomasza i Książęca",
  "Angola",
  "Zambia",
  "Zimbabwe",
  "Botswana",
  "Namibia",
  "RPA",
  "Lesotho",
  "Suazi",
  "Madagaskar",
  "Mauritius",
  "Seszele",
  "Komory",
  "Mozambik",
  "Malawi",
  "Zambia",
  "Zimbabwe",
  "Botswana",
  "Namibia",
  "RPA",
];

function ClientCreatorForm() {
  const [open, setOpen] = React.useState(false);
  const form = useForm<clientType>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: {
        street: "",
        postalCode: "",
        city: "",
        country: "Polska",
      },
      taxIdNumber: "",
    },
  });
  const router = useRouter();

  const { mutate: saveClient, isPending } = useMutation({
    mutationFn: async ({
      name,
      email,
      address,
      phoneNumber,
      taxIdNumber,
    }: clientType) => {
      const payload: clientType = {
        name,
        email,
        address,
        phoneNumber,
        taxIdNumber,
      };
      const { data } = await axios.post("/api/client", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.status === 400)
          return form.setError("email", {
            message: "Klient o podanym e-mailu już istnieje.",
          });
      }

      return toast.error("Wystąpił błąd podczas zapisywania klienta");
    },
    onSuccess: () => {
      toast.success("Pomyślnie zapisano klienta!");
      router.push("/clients");
      startTransition(() => {
        router.refresh();
      });
    },
  });

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header z przyciskiem powrotu */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Powrót
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nowy klient</h1>
          <p className="text-muted-foreground">
            Dodaj nowego klienta do swojej bazy danych
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => saveClient(data))}
          className="space-y-8"
        >
          {/* Sekcja podstawowych danych */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Podstawowe dane
              </CardTitle>
              <CardDescription>
                Wprowadź podstawowe informacje o kliencie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazwa klienta *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="np. Firma ABC Sp. z o.o."
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres e-mail *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="kontakt@firma.pl"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numer telefonu</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+48 123 456 789 lub +1 555 123 4567"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormDescription>
                        Opcjonalne pole - format międzynarodowy
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxIdNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numer identyfikacji podatkowej</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234567890 (PL) lub DE123456789 (DE)"
                          {...field}
                          className="h-11"
                          maxLength={20}
                        />
                      </FormControl>
                      <FormDescription>
                        Opcjonalne pole - format zależny od kraju
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sekcja adresu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Adres
              </CardTitle>
              <CardDescription>
                Wprowadź adres korespondencyjny klienta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Ulica i numer *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ul. Przykładowa 123 lub 123 Main Street"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kod pocztowy *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00-000 (PL) lub 12345 (US)"
                          {...field}
                          className="h-11"
                          maxLength={20}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Miejscowość *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Warszawa"
                          {...field}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Kraj *</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="h-11 w-full justify-between"
                            >
                              {field.value || "Wybierz kraj..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Wyszukaj kraj..." />
                            <CommandList>
                              <CommandEmpty>Nie znaleziono kraju.</CommandEmpty>
                              <CommandGroup>
                                {countries.map((country) => (
                                  <CommandItem
                                    key={country}
                                    value={country}
                                    onSelect={(currentValue) => {
                                      field.onChange(currentValue);
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        field.value === country
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }`}
                                    />
                                    {country}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Przyciski akcji */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isPending}
              className="h-11 px-8"
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={isPending} className="h-11 px-8">
              {isPending ? "Zapisywanie..." : "Zapisz klienta"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default ClientCreatorForm;
