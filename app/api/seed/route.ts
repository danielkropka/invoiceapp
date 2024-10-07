import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  console.log("dodało");
  /*  await db.client.create({
    data: {
      name: "Generator faktur",
      email: "invoices@test.pl",
      address: {
        street: "Jana III Sobieskiego 7/6",
        city: "Poddębice",
        postalCode: "99-200",
      },
    },
  });*/
  /*await db.invoice.createMany({
    data: [
      {
        invoiceId: "1/10/2024",
        status: "PAID",
        paymentMethod: "CASH",
        products: [
          {
            name: "Aplikacja internetowa",
            price: 1000,
            quantity: 1,
            vat: 23,
          },
        ],
        creatorId: "cm1utj08u0000yynbfmr2fhwe",
        clientId: "cm1v1hfxo0000inulwn2pdw5i",
      },
      {
        invoiceId: "2/10/2024",
        status: "PAID",
        paymentMethod: "CASH",
        products: [
          {
            name: "Usługi programistyczne",
            price: 1500,
            quantity: 2,
            vat: 23,
          },
        ],
        creatorId: "cm1utj08u0000yynbfmr2fhwe",
        clientId: "cm1v1hfxo0000inulwn2pdw5i",
      },
      {
        invoiceId: "3/10/2024",
        status: "PAID",
        paymentMethod: "CASH",
        products: [
          {
            name: "Strona internetowa",
            price: 1200,
            quantity: 1,
            vat: 23,
          },
        ],
        creatorId: "cm1utj08u0000yynbfmr2fhwe",
        clientId: "cm1v1hfxo0000inulwn2pdw5i",
      },
      {
        invoiceId: "4/10/2024",
        status: "PAID",
        paymentMethod: "CASH",
        products: [
          {
            name: "Aplikacja mobilna",
            price: 3000,
            quantity: 1,
            vat: 23,
          },
        ],
        creatorId: "cm1utj08u0000yynbfmr2fhwe",
        clientId: "cm1v1hfxo0000inulwn2pdw5i",
      },
      {
        invoiceId: "5/10/2024",
        status: "PAID",
        paymentMethod: "CASH",
        products: [
          {
            name: "Konsultacje IT",
            price: 500,
            quantity: 1,
            vat: 23,
          },
        ],
        creatorId: "cm1utj08u0000yynbfmr2fhwe",
        clientId: "cm1v1hfxo0000inulwn2pdw5i",
      },
      {
        invoiceId: "6/10/2024",
        status: "PAID",
        paymentMethod: "CASH",
        products: [
          {
            name: "Sprzęt komputerowy",
            price: 2000,
            quantity: 3,
            vat: 23,
          },
        ],
        creatorId: "cm1utj08u0000yynbfmr2fhwe",
        clientId: "cm1v1hfxo0000inulwn2pdw5i",
      },
      {
        invoiceId: "7/10/2024",
        status: "PAID",
        paymentMethod: "CASH",
        products: [
          {
            name: "Licencja na oprogramowanie",
            price: 100,
            quantity: 5,
            vat: 5,
          },
        ],
        creatorId: "cm1utj08u0000yynbfmr2fhwe",
        clientId: "cm1v1hfxo0000inulwn2pdw5i",
      },
      {
        invoiceId: "8/10/2024",
        status: "PAID",
        paymentMethod: "CASH",
        products: [
          {
            name: "Usługi graficzne",
            price: 800,
            quantity: 2,
            vat: 23,
          },
        ],
        creatorId: "cm1utj08u0000yynbfmr2fhwe",
        clientId: "cm1v1hfxo0000inulwn2pdw5i",
      },
      {
        invoiceId: "9/10/2024",
        status: "PAID",
        paymentMethod: "CASH",
        products: [
          {
            name: "Kampania marketingowa",
            price: 5000,
            quantity: 1,
            vat: 0,
          },
        ],
        creatorId: "cm1utj08u0000yynbfmr2fhwe",
        clientId: "cm1v1hfxo0000inulwn2pdw5i",
      },
      {
        invoiceId: "10/10/2024",
        status: "PAID",
        paymentMethod: "CASH",
        products: [
          {
            name: "Szkolenie IT",
            price: 2000,
            quantity: 1,
            vat: 23,
          },
        ],
        creatorId: "cm1utj08u0000yynbfmr2fhwe",
        clientId: "cm1v1hfxo0000inulwn2pdw5i",
      },
    ],
  });*/
}
