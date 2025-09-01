import { db } from "@/lib/prisma";
import { registerFormSchema } from "@/lib/validators/validators";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Rate limiting - prosta implementacja w pamięci (w produkcji użyj Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minut
const RATE_LIMIT_MAX_ATTEMPTS = 5; // maksymalnie 5 prób na 15 minut

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const headersList = headers();
    const ip =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Zbyt wiele prób rejestracji. Spróbuj ponownie za 15 minut." },
        { status: 429 }
      );
    }

    // Walidacja Content-Type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Nieprawidłowy typ zawartości" },
        { status: 400 }
      );
    }

    // Parsowanie i walidacja danych
    let body: unknown;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return NextResponse.json(
        { error: "Nieprawidłowy format JSON" },
        { status: 400 }
      );
    }

    // Walidacja schematu
    const validationResult = registerFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Nieprawidłowe dane",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Sprawdzenie czy użytkownik już istnieje
    const existingUser = await db.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Konto o podanym adresie e-mail już istnieje" },
        { status: 409 }
      );
    }

    // Hash hasła z wyższym salt rounds dla lepszego bezpieczeństwa
    const hashedPassword = await hash(password, 12);

    // Tworzenie użytkownika
    await db.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      },
    });

    // Logowanie sukcesu (w produkcji użyj proper logging)
    console.log(`New user registered: ${email} from IP: ${ip}`);

    return NextResponse.json(
      { message: "Konto zostało pomyślnie utworzone" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating account:", error);

    // Nie ujawniaj szczegółów błędu w odpowiedzi
    return NextResponse.json(
      { error: "Wystąpił błąd podczas tworzenia konta. Spróbuj ponownie." },
      { status: 500 }
    );
  }
}
