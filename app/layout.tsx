import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { FFmpegProvider } from "@/lib/contexts/ffmpeg-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ScaleStream - Video Processing Platform",
  description:
    "Convert videos to multiple resolutions automatically. Upload once, get 1080p, 720p, 480p, and 360p formats with real-time progress tracking.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <FFmpegProvider>{children}</FFmpegProvider>
        <Analytics />
      </body>
    </html>
  )
}
