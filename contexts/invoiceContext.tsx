import { ExtendedInvoice } from "@/types/db";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { toast } from "sonner";

const defaultContext = {
  invoicePDF: new Blob(),
  generatePDF: async (invoice: ExtendedInvoice) => {},
  downloadPDF: (name: string) => {},
  sentEmail: (
    email: string,
    clientName: string,
    invoiceDetails: {
      id: string;
      issuedDate: Date;
    },
    attachment: Buffer
  ) => {},
};

export const InvoiceContext = createContext(defaultContext);
export const useInvoiceContext = () => {
  return useContext(InvoiceContext);
};

export const InvoiceContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [invoicePDF, setInvoicePDF] = useState<Blob>(new Blob());

  const generatePDF = useCallback(async (invoice: ExtendedInvoice) => {
    try {
      const res = await fetch("/api/invoice/pdf", {
        method: "POST",
        body: JSON.stringify(invoice),
      });

      setInvoicePDF(await res.blob());
    } catch (err) {
      console.log(err);
      toast.error(
        "Wystąpił błąd w trakcie generowania faktury. Spróbuj ponownie później."
      );
    }
  }, []);

  const downloadPDF = (name: string) => {
    if (invoicePDF instanceof Blob && invoicePDF.size > 0) {
      const url = window.URL.createObjectURL(invoicePDF);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.pdf`;
      document.body.appendChild(a);

      a.click();

      window.URL.revokeObjectURL(url);
    }
  };

  const sentEmail = async (
    email: string,
    clientName: string,
    invoiceDetails: {
      id: string;
      issuedDate: Date;
    },
    attachment: Buffer
  ) => {
    try {
      await fetch("/api/invoice/send", {
        method: "POST",
        body: JSON.stringify({
          email,
          clientName,
          invoiceDetails,
          attachment,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        generatePDF,
        invoicePDF,
        downloadPDF,
        sentEmail,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
