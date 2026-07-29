import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Creates a Supabase Auth user for a sub-admin using the service role key,
 * so the currently signed-in super admin session is not replaced.
 * Falls back gracefully when the service role is not configured.
 */
export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey || serviceKey.length < 20) {
    return NextResponse.json({
      ok: false,
      skipped: true,
      message:
        "Local sub-admin created. Add SUPABASE_SERVICE_ROLE_KEY on the server to also create them in Supabase Auth.",
    });
  }

  let body: {
    email?: string;
    password?: string;
    fullName?: string;
    phone?: string;
    county?: string;
  };

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

  if (!email || password.length < 6 || !fullName) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        phone,
        county,
        role: "subadmin",
      },
    });

    if (error) {
      // Already exists is fine for our flow.
      if (/already|registered|exists/i.test(error.message)) {
        return NextResponse.json({ ok: true, existed: true });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      await admin.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        phone,
        county,
        role: "subadmin",
      });
    }

    return NextResponse.json({ ok: true, userId: data.user?.id ?? null });
  } catch (error) {
    console.error("Create sub-admin error:", error);
    return NextResponse.json(
      { error: "Could not create the sub-admin in Supabase." },
      { status: 500 },
    );
  }
}
