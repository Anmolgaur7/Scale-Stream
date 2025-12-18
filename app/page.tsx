import Link from "next/link"
import { Button } from "@/components/ui/button"
import { VideoIcon, Zap, Shield, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <VideoIcon className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-balance">ScaleStream</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <h1 className="text-5xl font-bold leading-tight text-balance md:text-6xl lg:text-7xl">
            Convert Videos to{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Multiple Resolutions
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty md:text-xl">
            Upload once, get multiple formats. ScaleStream automatically converts your videos to 1080p, 720p, 480p, and
            360p with real-time progress tracking.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg">
                Start Converting
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="glass rounded-2xl p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Lightning Fast</h3>
            <p className="text-muted-foreground text-pretty">
              Process videos in parallel with our optimized conversion engine. Get all formats in minutes.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
              <Shield className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Secure & Private</h3>
            <p className="text-muted-foreground text-pretty">
              Your videos are encrypted and stored securely. Only you have access to your content.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
              <Globe className="h-8 w-8 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Multiple Formats</h3>
            <p className="text-muted-foreground text-pretty">
              Get 1080p, 720p, 480p, and 360p versions automatically. Perfect for any device or bandwidth.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="glass-strong rounded-3xl p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl">Ready to scale your videos?</h2>
          <p className="mb-8 text-lg text-muted-foreground text-pretty">
            Join thousands of creators who trust ScaleStream for their video processing needs.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>© 2025 ScaleStream. All rights reserved.</p>
      </footer>
    </div>
  )
}
