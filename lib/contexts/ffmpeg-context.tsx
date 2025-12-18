"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { toBlobURL } from "@ffmpeg/util"

interface FFmpegContextType {
  ffmpeg: FFmpeg | null
  isLoaded: boolean
  isLoading: boolean
  error: string | null
  loadFFmpeg: () => Promise<void>
}

const FFmpegContext = createContext<FFmpegContextType | undefined>(undefined)

export function FFmpegProvider({ children }: { children: ReactNode }) {
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFFmpeg = async () => {
    if (isLoading || ffmpegRef.current) return

    try {
      setIsLoading(true)
      setError(null)

      const ffmpeg = new FFmpeg()

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd"

      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
      })

      ffmpegRef.current = ffmpeg
      setIsLoaded(true)
    } catch (err: any) {
      console.warn("FFmpeg not available, using fallback processing")
      ffmpegRef.current = null
      setIsLoaded(true)
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFFmpeg()
  }, [])

  return (
    <FFmpegContext.Provider
      value={{
        ffmpeg: ffmpegRef.current,
        isLoaded,
        isLoading,
        error,
        loadFFmpeg,
      }}
    >
      {children}
    </FFmpegContext.Provider>
  )
}

export function useFFmpeg() {
  const context = useContext(FFmpegContext)
  if (context === undefined) {
    throw new Error("useFFmpeg must be used within a FFmpegProvider")
  }
  return context
}
