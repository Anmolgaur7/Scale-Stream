import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"

  if (code) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // Verify user record exists
      await supabase.from("users").select("id").eq("id", data.user.id).single()

      // Success - redirect to dashboard
      return NextResponse.redirect(new URL(next, request.url))
    }

    // Error during exchange
    return NextResponse.redirect(new URL("/auth/confirm?error=true", request.url))
  }

  // No code provided
  return NextResponse.redirect(new URL("/auth/login", request.url))
}
