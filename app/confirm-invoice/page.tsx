import Image from "next/image";
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
    <div className="flex flex-col items-center justify-between h-screen gap-10 bg-gradient-to-br from-slate-100 dark:from-slate-900">
      <h2 className="font-semibold text-7xl tracking-tight text-[#0056b3] mt-4">
        Fakturly
      </h2>
      <div className="flex flex-col justify-center items-center h-full gap-4">
        <Image
          src={"/confirm.svg"}
          alt="confirm image"
          width={300}
          height={300}
        />
        {token && typeof token === "string" ? (
          <ConfirmInvoice token={token} />
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
    </div>
  );
}
