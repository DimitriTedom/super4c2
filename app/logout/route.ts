import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createSupabaseServerClient } from "@/lib/supabase/server";

async function handleSignOut(request: Request) {
  const url = new URL(request.url);
  const cookieStore = await cookies();

  // Clear demo candidate cookie
  cookieStore.delete("sb-super4c2-demo-candidate");

  const supabase = await createSupabaseServerClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
  }

  return NextResponse.redirect(new URL("/", url.origin), { status: 303 });
}

export async function POST(request: Request) {
  return handleSignOut(request);
}

export async function GET(request: Request) {
  return handleSignOut(request);
}
