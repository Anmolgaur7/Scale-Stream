"use client"

import { VideoIcon } from "lucide-react"
import { VideoCard } from "./video-card"
import { useVideoRealtime } from "@/lib/hooks/use-video-realtime"
import { Skeleton } from "@/components/ui/skeleton"

interface VideoListRealtimeProps {
  userId: string
}

export function VideoListRealtime({ userId }: VideoListRealtimeProps) {
  const { videos, loading } = useVideoRealtime(userId)

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-xl overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-2 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <VideoIcon className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
        <h3 className="mb-2 text-xl font-semibold">No videos yet</h3>
        <p className="text-muted-foreground">Upload your first video to get started</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
