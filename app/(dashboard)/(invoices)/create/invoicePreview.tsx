import { Eye, FileText, Calendar, User, Package } from "lucide-react";
import { invoiceType } from "./invoice-creator-form";
import { Client } from "@prisma/client";
import React from "react";
import moment from "moment";

export default function InvoicePreview({
  formData,
  client,
}: {
  formData: invoiceType;
  client: Client | undefined;
}) {
  const { invoiceId, issuedAt, soldAt, products, exemptTax } = formData;
  const isPreviewAvailable =
    invoiceId &&
    issuedAt &&
    soldAt &&
    products.length > 0 &&
    client &&
    client.id;

  // Obliczanie sum z podatkiem
  const calculateTotals = () => {
    let subtotal = 0;
    let totalVat = 0;
    let total = 0;

    products.forEach((product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 0;
      const vatRate = Number(product.vat) || 0;

      const productTotal = price * quantity;
      const productVat = exemptTax ? 0 : (productTotal * vatRate) / 100;

      subtotal += productTotal;
      totalVat += productVat;
    });

    total = subtotal + totalVat;

    return { subtotal, totalVat, total };
  };

  const { subtotal, totalVat, total } = calculateTotals();

  return (
    <div className="bg-gradient-to-br from-muted/30 to-muted/60 backdrop-blur-sm rounded-2xl max-w-4xl p-6 lg:p-8 relative transition-all duration-500 ease-in-out border border-border/50 w-full">
      {/* Header */}
      <div className="border-b border-border/30 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Podgląd faktury
          </h1>
        </div>
      </div>

      {isPreviewAvailable ? (
        <div className="space-y-6">
          {/* Main Invoice Card */}
          <div className="bg-background/80 backdrop-blur-sm shadow-xl rounded-xl border border-border/50 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between border-b border-border/30 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-xl text-foreground">
                  Faktura {invoiceId}
                </span>
              </div>
              <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-sm font-medium text-primary">Gotowa</span>
              </div>
            </div>

            {/* Invoice Details Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Issue Date */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Data wystawienia
                  </span>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {moment(issuedAt).format("LL")}
                </span>
              </div>

              {/* Sale Date */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Data sprzedaży
                  </span>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {moment(soldAt).format("LL")}
                </span>
              </div>

              {/* Client Info */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-colors duration-200 col-span-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <User className="h-4 w-4 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Klient
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-lg font-semibold text-foreground block truncate">
                    {client?.name}
                  </span>
                  <span className="text-muted-foreground block truncate">
                    {client?.email}
                  </span>
                </div>
              </div>

              {/* Products Summary */}
              <div className="bg-muted/30 rounded-lg p-4 border border-border/30 hover:border-primary/30 transition-colors duration-200 col-span-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Package className="h-4 w-4 text-orange-500" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Produkty
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-semibold text-foreground">
                    {products.length}
                  </span>
                  <span className="text-muted-foreground">
                    {products.length === 1
                      ? "produkt"
                      : products.length < 5
                      ? "produkty"
                      : "produktów"}
                  </span>
                </div>

                {/* Products List */}
                <div className="space-y-3">
                  {products.map((product, index) => {
                    const price = Number(product.price) || 0;
                    const quantity = Number(product.quantity) || 0;
                    const vatRate = Number(product.vat) || 0;
                    const productTotal = price * quantity;
                    const productVat = exemptTax
                      ? 0
                      : (productTotal * vatRate) / 100;

                    return (
                      <div
                        key={index}
                        className="bg-background/60 rounded-lg p-3 border border-border/20 hover:border-primary/20 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">
                              {product.name || "Nazwa produktu"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {product.description || "Brak opisu"}
                            </p>
                            {!exemptTax && vatRate > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                VAT: {vatRate}%
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-4 ml-4">
                            <div className="text-right">
                              <span className="text-sm text-muted-foreground">
                                {quantity} x {price.toFixed(2)} zł
                              </span>
                              <div className="text-lg font-semibold text-foreground">
                                {productTotal.toFixed(2)} zł
                              </div>
                              {!exemptTax && vatRate > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  +{productVat.toFixed(2)} zł VAT
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Financial Summary */}
                {products.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-border/30 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Netto:</span>
                      <span className="font-medium">
                        {subtotal.toFixed(2)} zł
                      </span>
                    </div>
                    {!exemptTax && totalVat > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">VAT:</span>
                        <span className="font-medium text-orange-600">
                          {totalVat.toFixed(2)} zł
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-border/20">
                      <span className="text-lg font-semibold text-foreground">
                        Razem:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {total.toFixed(2)} zł
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-background/60 backdrop-blur-sm rounded-xl border border-border/30 p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Ikona i animacja */}
            <div className="relative">
              <div className="p-6 bg-gradient-to-br from-muted/40 to-muted/60 rounded-full border border-border/30">
                <Eye className="h-16 w-16 text-muted-foreground/50" />
              </div>
              {/* Animowane kropki */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-primary/40 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary/40 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>

            {/* Tekst informacyjny */}
            <div className="space-y-3 max-w-sm">
              <h3 className="text-xl font-semibold text-foreground">
                Podgląd niedostępny
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Aby zobaczyć podgląd faktury, uzupełnij wszystkie wymagane pola
                w formularzu
              </p>
            </div>

            {/* Lista wymaganych pól */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/20 w-full max-w-xs">
              <h4 className="text-sm font-medium text-foreground mb-3">
                Wymagane pola:
              </h4>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500/60 rounded-full"></div>
                  <span className="text-muted-foreground">Numer faktury</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500/60 rounded-full"></div>
                  <span className="text-muted-foreground">
                    Data wystawienia
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500/60 rounded-full"></div>
                  <span className="text-muted-foreground">Data sprzedaży</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500/60 rounded-full"></div>
                  <span className="text-muted-foreground">Wybór klienta</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500/60 rounded-full"></div>
                  <span className="text-muted-foreground">
                    Dodanie produktów
                  </span>
                </div>
              </div>
            </div>

            {/* Zachęta do działania */}
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <p className="text-sm text-primary font-medium">
                💡 Zacznij od wypełnienia podstawowych danych faktury
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
