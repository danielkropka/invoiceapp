import { SendEmailToClientType } from "@/types/db";
import axios, { AxiosError } from "axios";
import { createContext, ReactNode, useContext } from "react";
import { toast } from "sonner";

const defaultContext = {
  downloadPDF: (file: string, fileName: string) => {},
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
  const downloadPDF = (file: string, fileName: string) => {
    const invoicePDF = new Blob([Buffer.from(file, "base64")]);

    if (invoicePDF instanceof Blob && invoicePDF.size > 0) {
      const url = window.URL.createObjectURL(invoicePDF);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.pdf`;
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
        downloadPDF,
        sentEmail,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
