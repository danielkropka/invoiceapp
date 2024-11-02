import ConfirmInvoice from "./confirmInvoice";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default function ConfirmInvoicePage({ searchParams }: PageProps) {
  const token = searchParams.token;
  const toEmail = searchParams.to;

  return (
    <div className="flex items-center justify-center h-screen">
      {token && typeof token === "string" ? (
        <ConfirmInvoice />
      ) : (
        <div className="flex h-full flex-col items-center justify-center space-y-1">
          <h3 className="font-semibold text-2xl">
            Sprawdź swoją skrzynkę pocztową
          </h3>

          {toEmail ? (
            <p className="text-muted-foreground text-center">
              Twoją fakturę wysłaliśmy na podany email{" "}
              <span className="font-semibold">{toEmail}</span>.
            </p>
          ) : (
            <p className="text-muted-foreground text-center">
              Wysłaliśmy fakturę na twojego e-maila.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
