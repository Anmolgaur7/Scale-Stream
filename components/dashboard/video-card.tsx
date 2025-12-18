"use client"

import { Video, Clock, Check, AlertCircle, Loader2, Play, Download } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { VideoWithJobs } from "@/lib/types"
import { useVideoConverter } from "@/lib/hooks/use-video-converter"
import { useFFmpeg } from "@/lib/contexts/ffmpeg-context"
import { useState } from "react"

interface VideoCardProps {
  video: VideoWithJobs
}

export function VideoCard({ video }: VideoCardProps) {
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { convertVideo, converting } = useVideoConverter()
  const { isLoaded, isLoading } = useFFmpeg()

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const completedJobs = video.conversion_jobs?.filter((job) => job.status === "completed").length || 0
  const processingJobs = video.conversion_jobs?.filter((job) => job.status === "processing").length || 0
  const totalJobs = video.conversion_jobs?.length || 0
  const overallProgress = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0
  const hasStarted = video.conversion_jobs?.some((job) => job.status !== "pending")

  const handleDownload = async (job: VideoWithJobs["conversion_jobs"][0]) => {
    if (!job.output_url) return

    try {
      const response = await fetch(job.output_url)

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `${video.title}-${job.resolution}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading file:", error)
      alert(`Failed to download video: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleStartConversion = async () => {
    if (!isLoaded) {
      setError("Video converter is still loading. Please wait...")
      return
    }

    setIsStarting(true)
    setError(null)

    try {
      const pendingJobs = video.conversion_jobs.filter((job) => job.status === "pending")

      if (pendingJobs.length === 0) {
        setError("No pending conversions found")
        return
      }

      await convertVideo(video.id, video.storage_path, pendingJobs)
    } catch (error) {
      console.error("Error starting conversion:", error)
      setError(error instanceof Error ? error.message : "Failed to start conversion")
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="glass rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
      {/* Thumbnail placeholder */}
      <div className="aspect-video bg-muted/50 flex items-center justify-center relative overflow-hidden">
        <Video className="h-12 w-12 text-muted-foreground opacity-50" />
        {processingJobs > 0 && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">
                Processing {processingJobs} {processingJobs === 1 ? "file" : "files"}...
              </p>
            </div>
          </div>
        )}
        {completedJobs === totalJobs && totalJobs > 0 && (
          <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5">
            <Check className="h-3 w-3" />
            <span className="text-xs font-medium">Complete</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Title and metadata */}
        <div>
          <h3 className="font-semibold text-lg mb-1 text-balance line-clamp-1">{video.title}</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{formatFileSize(video.file_size)}</span>
            <span>{formatDate(video.created_at)}</span>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading video converter...</span>
          </div>
        )}

        {/* Start conversion button if not started */}
        {!hasStarted && (
          <div className="space-y-2">
            <Button
              onClick={handleStartConversion}
              disabled={isStarting || converting || isLoading || !isLoaded}
              className="w-full"
              size="sm"
            >
              {isStarting || converting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isStarting ? "Starting..." : "Converting..."}
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Conversion
                </>
              )}
            </Button>
            {error && <p className="text-xs text-destructive text-center">{error}</p>}
          </div>
        )}

        {hasStarted && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Overall Progress: {completedJobs}/{totalJobs}
              </span>
              <span className="font-semibold text-primary">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2.5" />
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Resolutions</p>
          {video.conversion_jobs?.map((job) => (
            <div key={job.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(job.status)}
                  <span className="text-sm font-medium">{job.resolution}</span>
                </div>
                <div className="flex items-center gap-2">
                  {job.status === "processing" && (
                    <span className="text-sm text-primary font-semibold">{job.progress}%</span>
                  )}
                  {job.status === "completed" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2"
                      onClick={() => handleDownload(job)}
                      title={`Download ${job.resolution} version`}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {job.status === "pending" && <span className="text-xs text-muted-foreground">Queued</span>}
                </div>
              </div>
              {(job.status === "processing" || job.status === "completed") && (
                <Progress value={job.progress || 0} className="h-1.5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
