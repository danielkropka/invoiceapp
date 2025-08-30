import moment from "moment";
import "moment/locale/pl";

export default function EmailTemplate({
  sentToName,
  invoiceDetails,
  token,
}: {
  sentToName: string;
  invoiceDetails: {
    id: string;
    issuedDate: Date;
  };
  token: string;
}) {
  const { id: invoiceId, issuedDate } = invoiceDetails;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
          paddingBottom: "20px",
          borderBottom: "2px solid #f0f0f0",
        }}
      >
        <h1
          style={{
            color: "#2563eb",
            fontSize: "28px",
            margin: "0",
            fontWeight: "600",
          }}
        >
          Fakturly
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: "5px 0 0 0" }}>
          Profesjonalne zarządzanie fakturami
        </p>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: "25px" }}>
        <h2
          style={{
            color: "#1f2937",
            fontSize: "20px",
            margin: "0 0 15px 0",
            fontWeight: "500",
          }}
        >
          Dzień dobry {sentToName},
        </h2>
      </div>

      {/* Main Content */}
      <div
        style={{ marginBottom: "25px", lineHeight: "1.6", color: "#374151" }}
      >
        <p style={{ margin: "0 0 15px 0", fontSize: "16px" }}>
          Dziękujemy za zaufanie i skorzystanie z naszych usług. W załączniku
          przesyłamy fakturę nr{" "}
          <strong style={{ color: "#2563eb", fontWeight: "600" }}>
            {invoiceId}
          </strong>{" "}
          wystawioną dnia{" "}
          <strong style={{ color: "#059669", fontWeight: "600" }}>
            {moment(issuedDate).format("LL")}
          </strong>
          .
        </p>

        <p style={{ margin: "0 0 15px 0", fontSize: "16px" }}>
          Faktura została przygotowana zgodnie z najwyższymi standardami i
          zawiera wszystkie niezbędne informacje dotyczące świadczonych usług
          oraz warunków płatności.
        </p>
      </div>

      {/* Call to Action */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "25px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#374151" }}>
          <strong>Potwierdź opłacenie faktury</strong>
        </p>
        <a
          href={`https://www.fakturly.pl/confirm-invoice?token=${token}`}
          style={{
            display: "inline-block",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "12px 24px",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "500",
            fontSize: "16px",
          }}
        >
          Potwierdź płatność
        </a>
      </div>

      {/* Additional Info */}
      <div
        style={{
          backgroundColor: "#fef3c7",
          border: "1px solid #f59e0b",
          borderRadius: "6px",
          padding: "15px",
          marginBottom: "25px",
        }}
      >
        <p
          style={{
            margin: "0",
            fontSize: "14px",
            color: "#92400e",
            lineHeight: "1.5",
          }}
        >
          💡 <strong>Warto wiedzieć:</strong> Po potwierdzeniu płatności
          otrzymasz powiadomienie, a status faktury zostanie automatycznie
          zaktualizowany w naszym systemie.
        </p>
      </div>

      {/* Support Info */}
      <div
        style={{
          marginBottom: "25px",
          padding: "20px",
          backgroundColor: "#f9fafb",
          borderRadius: "6px",
        }}
      >
        <p style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#374151" }}>
          <strong>Potrzebujesz pomocy?</strong>
        </p>
        <p
          style={{
            margin: "0",
            fontSize: "14px",
            color: "#6b7280",
            lineHeight: "1.5",
          }}
        >
          W razie pytań lub wątpliwości dotyczących faktury, nasz zespół
          wsparcia jest do Twojej dyspozycji. Chętnie pomożemy w każdej sprawie!
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          paddingTop: "20px",
          borderTop: "2px solid #f0f0f0",
          color: "#6b7280",
        }}
      >
        <p style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
          Dziękujemy za terminowe uregulowanie należności.
        </p>
        <p style={{ margin: "0", fontSize: "14px" }}>
          Pozdrawiamy serdecznie,
          <br />
          <strong style={{ color: "#2563eb" }}>Zespół Fakturly</strong>
        </p>
        <div style={{ marginTop: "15px", fontSize: "12px", color: "#9ca3af" }}>
          <p style={{ margin: "0" }}>
            To jest automatyczna wiadomość. Prosimy nie odpowiadać na ten email.
          </p>
        </div>
      </div>
    </div>
  );
}
