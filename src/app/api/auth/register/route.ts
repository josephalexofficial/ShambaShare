import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  email?: string;
  password?: string;
  fullName?: string;
  phone?: string;
  county?: string;
  role?: string;
};

/**
 * Creates (or repairs) a Supabase Auth user with email already confirmed,
 * so Join → Sign in works immediately on the hosted site across devices.
 * Requires SUPABASE_SERVICE_ROLE_KEY on the server (Vercel env).
 */
export async function POST(req: Request) {
  const admin = createServiceRoleClient();
  if (!admin) {
    return NextResponse.json({
      ok: false,
      skipped: true,
      message:
        "Service role not configured. Falling back to client signup.",
    });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(body.password ?? "").trim();
  const fullName = String(body.fullName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const county = String(body.county ?? "Uasin Gishu").trim();
  const role = String(body.role ?? "both").trim();

  if (!email || !email.includes("@") || password.length < 6 || !fullName) {
    return NextResponse.json(
      { error: "Enter a valid email, name, and password (6+ characters)." },
      { status: 400 },
    );
  }

  const metadata = {
    full_name: fullName,
    phone,
    county,
    role,
  };

  try {
    const created = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: metadata,
    });

    if (!created.error && created.data.user) {
      await admin.from("profiles").upsert({
        id: created.data.user.id,
        full_name: fullName,
        phone,
        county,
        role,
      });
      return NextResponse.json({
        ok: true,
        userId: created.data.user.id,
        created: true,
      });
    }

    const message = created.error?.message ?? "";
    if (!/already|registered|exists/i.test(message)) {
      return NextResponse.json(
        { error: message || "Could not create account." },
        { status: 400 },
      );
    }

    // Account exists — repair it so login works (confirm email + refresh password/metadata).
    const existingId = await findUserIdByEmail(admin, email);
    if (!existingId) {
      return NextResponse.json({
        ok: true,
        existed: true,
        repaired: false,
      });
    }

    const updated = await admin.auth.admin.updateUserById(existingId, {
      password,
      email_confirm: true,
      user_metadata: metadata,
    });

    if (updated.error) {
      return NextResponse.json(
        { error: updated.error.message },
        { status: 400 },
      );
    }

    await admin.from("profiles").upsert({
      id: existingId,
      full_name: fullName,
      phone,
      county,
      role,
    });

    return NextResponse.json({
      ok: true,
      userId: existingId,
      existed: true,
      repaired: true,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Could not create the account on the server." },
      { status: 500 },
    );
  }
}

async function findUserIdByEmail(
  admin: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  email: string,
): Promise<string | null> {
  // Paginate lightly — fine for hackathon / early scale.
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) {
      console.warn("listUsers failed:", error.message);
      return null;
    }
    const match = data.users.find(
      (user) => (user.email ?? "").toLowerCase() === email,
    );
    if (match) return match.id;
    if (data.users.length < 200) break;
  }
  return null;
}
