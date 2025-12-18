"use client"

import { useFFmpeg } from "@/lib/contexts/ffmpeg-context"
import { Check } from "lucide-react"

export function FFmpegStatus() {
  const { isLoaded } = useFFmpeg()

  if (isLoaded) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
        <Check className="h-4 w-4" />
        <span>Video converter ready</span>
      </div>
    )
  }

  return null
}
