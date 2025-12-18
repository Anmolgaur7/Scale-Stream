"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { VideoWithJobs } from "@/lib/types"
import type { RealtimeChannel } from "@supabase/supabase-js"

export function useVideoRealtime(userId: string) {
  const [videos, setVideos] = useState<VideoWithJobs[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel

    const setupRealtime = async () => {
      // Initial fetch
      const { data, error } = await supabase
        .from("videos")
        .select(
          `
          *,
          conversion_jobs (*)
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setVideos(data as VideoWithJobs[])
      }
      setLoading(false)

      // Subscribe to video changes
      channel = supabase
        .channel("video_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "videos",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log("[v0] Video change:", payload)
            handleVideoChange(payload)
          },
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversion_jobs",
          },
          (payload) => {
            console.log("[v0] Conversion job change:", payload)
            handleJobChange(payload)
          },
        )
        .subscribe()
    }

    const handleVideoChange = (payload: any) => {
      if (payload.eventType === "INSERT") {
        // Fetch the new video with its jobs
        supabase
          .from("videos")
          .select(
            `
            *,
            conversion_jobs (*)
          `,
          )
          .eq("id", payload.new.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setVideos((prev) => [data as VideoWithJobs, ...prev])
            }
          })
      } else if (payload.eventType === "UPDATE") {
        setVideos((prev) => prev.map((video) => (video.id === payload.new.id ? { ...video, ...payload.new } : video)))
      } else if (payload.eventType === "DELETE") {
        setVideos((prev) => prev.filter((video) => video.id !== payload.old.id))
      }
    }

    const handleJobChange = (payload: any) => {
      setVideos((prev) =>
        prev.map((video) => {
          if (video.id === payload.new?.video_id || video.id === payload.old?.video_id) {
            const videoId = payload.new?.video_id || payload.old?.video_id

            if (payload.eventType === "UPDATE") {
              return {
                ...video,
                conversion_jobs: video.conversion_jobs?.map((job) =>
                  job.id === payload.new.id ? { ...job, ...payload.new } : job,
                ),
              }
            } else if (payload.eventType === "INSERT") {
              return {
                ...video,
                conversion_jobs: [...(video.conversion_jobs || []), payload.new],
              }
            } else if (payload.eventType === "DELETE") {
              return {
                ...video,
                conversion_jobs: video.conversion_jobs?.filter((job) => job.id !== payload.old.id),
              }
            }
          }
          return video
        }),
      )
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [userId])

  return { videos, loading }
}
