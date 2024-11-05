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
    <>
      <h2
        style={{
          color: "#0056b3",
        }}
      >
        Dzień dobry {sentToName},
      </h2>
      <p>
        Dziękujemy za skorzystanie z naszych usług. W załączniku przesyłamy
        fakturę nr <strong>{invoiceId}</strong> z dnia&nbsp;
        <strong>{moment(issuedDate).format("LL")}</strong>.
      </p>
      <p>
        W razie jakichkolwiek pytań lub wątpliwości dotyczących faktury, prosimy
        o kontakt. Nasz zespół chętnie pomoże!
      </p>

      <p>Dziękujemy za terminowe uregulowanie należności.</p>
      {/* TODO: Button to confirm, and send notification to user that invoice was paid, and he can change invoice status to paid */}
      <a href={`https://www.fakturly.pl/confirm-invoice?token=${token}`}>
        <button type="button">Potwierdź opłacenie faktury.</button>
      </a>

      <p>
        Pozdrawiamy serdecznie, Zespół <strong>Fakturly</strong>
      </p>
    </>
  );
}
