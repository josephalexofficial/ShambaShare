import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * If login fails only because the email is unconfirmed, confirm it (service
 * role) after verifying the password attempt reports that specific error.
 */
export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const admin = createServiceRoleClient();

  if (!url || !anon || !admin) {
    return NextResponse.json({ ok: false, skipped: true });
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const password = String(body.password ?? "").trim();
  if (!email || password.length < 6) {
    return NextResponse.json({ error: "Missing credentials." }, { status: 400 });
  }

  try {
    const browser = createClient(url, anon, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await browser.auth.signInWithPassword({ email, password });

    if (!error) {
      return NextResponse.json({ ok: true, alreadyReady: true });
    }

    if (!/email not confirmed/i.test(error.message)) {
      return NextResponse.json({
        ok: false,
        reason: error.message,
      });
    }

    const userId = await findUserIdByEmail(admin, email);
    if (!userId) {
      return NextResponse.json({ ok: false, reason: "User not found." });
    }

    const updated = await admin.auth.admin.updateUserById(userId, {
      email_confirm: true,
    });
    if (updated.error) {
      return NextResponse.json({ error: updated.error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, confirmed: true });
  } catch (error) {
    console.error("Confirm-email error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

async function findUserIdByEmail(
  admin: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  email: string,
): Promise<string | null> {
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) return null;
    const match = data.users.find(
      (user) => (user.email ?? "").toLowerCase() === email,
    );
    if (match) return match.id;
    if (data.users.length < 200) break;
  }
  return null;
}
