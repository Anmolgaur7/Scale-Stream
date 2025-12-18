import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { VideoIcon } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <VideoIcon className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">ScaleStream</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-balance">Welcome back</h2>
          <p className="mt-2 text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
