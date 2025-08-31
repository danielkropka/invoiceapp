# Fakturly

Fakturly to aplikacja webowa do generowania, zarządzania i wysyłania faktur. Umożliwia łatwe tworzenie faktur, zarządzanie klientami, usuwanie nieaktualnych dokumentów oraz wysyłanie faktur na adresy e-mail klientów. W dashboardzie dostępne jest podsumowanie z fakturami i wynikami finansowymi z poprzedniego miesiąca.

## Funkcje

- Tworzenie nowych faktur z możliwością dodawania szczegółowych informacji
- Zarządzanie klientami, w tym tworzenie, edytowanie i usuwanie klientów
- Usuwanie wybranych faktur
- Wysyłanie faktur na adres e-mail klienta za pomocą usługi Resend
- Dashboard z podsumowaniem wyników z poprzedniego miesiąca

## Technologie

Projekt został zbudowany z użyciem następujących technologii:

- **Next.js** – framework React do tworzenia aplikacji webowych z wykorzystaniem SSR i SSG
- **MongoDB** – baza danych NoSQL do przechowywania informacji o klientach i fakturach
- **Prisma** – ORM ułatwiający pracę z bazą MongoDB
- **Resend** – usługa do wysyłania e-maili
- **Tailwind CSS** – framework CSS do stylizacji aplikacji
- **Chromium** – do generowania PDF-ów z faktur

## Instalacja

Aby uruchomić projekt lokalnie, wykonaj poniższe kroki:

1. Sklonuj repozytorium:
   
   ```bash
   git clone https://github.com/danielkropka/invoiceapp.git
    ```
2. Przejdź do katalogu projektu:
   
    ```
    cd invoiceapp
    ```
3. Zainstaluj biblioteki:
   
    ```
    npm i
    ```
4. Skonfiguruj zmienne środowiskowe:
   

- Utwórz plik .env w katalogu głównym projektu.
- Dodaj dane do połączenia z MongoDB, konfiguracji Resend i inne niezbędne klucze API.
5. Uruchom aplikację w trybie deweloperskim:
  
    ```bash
    npm run dev
    ```
## Przyszłe Plany
- Wprowadzenie wielojęzyczności i wsparcia dla różnych walut
- Dodanie bardziej rozbudowanych raportów i analiz w dashboardzie
