import moment from "moment";
import "moment/locale/pl";

export default function EmailTemplate({
  sentToName,
  invoiceDetails,
}: {
  sentToName: string;
  invoiceDetails: {
    id: string;
    issuedDate: Date;
  };
}) {
  const { id, issuedDate } = invoiceDetails;

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
        fakturę nr <strong>{id}</strong> z dnia{" "}
        <strong>{moment(issuedDate).format("LL")}</strong>.
      </p>
      <p>
        W razie jakichkolwiek pytań lub wątpliwości dotyczących faktury, prosimy
        o kontakt. Nasz zespół chętnie pomoże!
      </p>

      <p>Dziękujemy za terminowe uregulowanie należności.</p>

      <p>
        Pozdrawiamy serdecznie, Zespół <strong>Fakturly</strong>
      </p>
    </>
  );
}
