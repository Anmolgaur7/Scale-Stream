import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"
import { VideoIcon } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <VideoIcon className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold">ScaleStream</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-balance">Create your account</h2>
          <p className="mt-2 text-muted-foreground">Start converting videos in minutes</p>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <SignupForm />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
