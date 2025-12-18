import { CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ConfirmPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string }
}) {
  const isSuccess = searchParams.success === "true"
  const isError = searchParams.error === "true"

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 rounded-2xl">
          {isSuccess && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h1 className="text-2xl font-bold">Email Confirmed!</h1>
              <p className="text-muted-foreground">
                Your email has been successfully verified. You can now sign in to your account.
              </p>
              <Button asChild className="w-full mt-6">
                <Link href="/auth/login">Go to Login</Link>
              </Button>
            </div>
          )}

          {isError && (
            <div className="text-center space-y-4">
              <XCircle className="h-16 w-16 text-destructive mx-auto" />
              <h1 className="text-2xl font-bold">Confirmation Failed</h1>
              <p className="text-muted-foreground">
                We couldn't verify your email. The link may have expired or been used already.
              </p>
              <Button asChild variant="outline" className="w-full mt-6 bg-transparent">
                <Link href="/auth/signup">Try Signing Up Again</Link>
              </Button>
            </div>
          )}

          {!isSuccess && !isError && (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl">📧</span>
              </div>
              <h1 className="text-2xl font-bold">Check Your Email</h1>
              <p className="text-muted-foreground">
                We've sent you a confirmation link. Click the link in your email to verify your account.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mt-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Didn't receive the email?</strong>
                  <br />
                  Check your spam folder or try signing up again.
                </p>
              </div>
              <Button asChild variant="outline" className="w-full mt-6 bg-transparent">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
