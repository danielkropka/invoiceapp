import { ExtendedInvoice, SendEmailToClientType } from "@/types/db";
import axios, { AxiosError } from "axios";
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
  sentEmail: (data: SendEmailToClientType) => {},
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

  const sentEmail = async (data: SendEmailToClientType) => {
    try {
      const { email, attachment, clientName, token, invoiceDetails } = data;
      await axios.post("/api/invoice/send", {
        email,
        clientName,
        invoiceDetails,
        token,
        attachment,
      });

      toast.success("Pomyślnie wysłano e-mail'a do klienta.");
    } catch (err) {
      if (err instanceof AxiosError)
        if (err.status === 409) return toast.info("E-mail został już wysłany.");
      toast.error(
        "Wystąpił błąd podczas wysyłania e-mail'a. Spróbuj ponownie później."
      );
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
