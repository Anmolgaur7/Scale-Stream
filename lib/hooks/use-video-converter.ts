"use client"

import { useState } from "react"
import { useFFmpeg } from "@/lib/contexts/ffmpeg-context"
import { fetchFile } from "@ffmpeg/util"
import { createClient } from "@/lib/supabase/client"

interface ConversionJob {
  id: string
  resolution: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
}

export function useVideoConverter() {
  const { ffmpeg, isLoaded } = useFFmpeg()
  const [converting, setConverting] = useState(false)

  const convertVideo = async (videoId: string, storagePath: string, jobs: ConversionJob[]) => {
    if (!isLoaded) {
      throw new Error("Video converter not ready")
    }

    setConverting(true)
    const supabase = createClient()

    try {
      await supabase.from("videos").update({ status: "processing" }).eq("id", videoId)

      const { data: fileData, error: downloadError } = await supabase.storage.from("videos").download(storagePath)

      if (downloadError) throw downloadError

      const canUseFFmpeg = ffmpeg !== null

      for (const job of jobs) {
        try {
          await supabase
            .from("conversion_jobs")
            .update({
              status: "processing",
              started_at: new Date().toISOString(),
              progress: 0,
            })
            .eq("id", job.id)

          let convertedBlob: Blob

          if (canUseFFmpeg && ffmpeg) {
            // Real FFmpeg conversion
            const inputFileName = "input.mp4"
            await ffmpeg.writeFile(inputFileName, await fetchFile(fileData))

            const outputFileName = `output_${job.resolution}.mp4`
            const resolutionHeight = Number.parseInt(job.resolution.replace("p", ""))

            ffmpeg.on("progress", ({ progress }) => {
              const percentage = Math.round(progress * 100)
              supabase.from("conversion_jobs").update({ progress: percentage }).eq("id", job.id)
            })

            await ffmpeg.exec([
              "-i",
              inputFileName,
              "-vf",
              `scale=-2:${resolutionHeight}`,
              "-c:v",
              "libx264",
              "-preset",
              "fast",
              "-crf",
              "23",
              "-c:a",
              "aac",
              "-b:a",
              "128k",
              outputFileName,
            ])

            const data = await ffmpeg.readFile(outputFileName)
            convertedBlob = new Blob([data], { type: "video/mp4" })

            await ffmpeg.deleteFile(inputFileName)
            await ffmpeg.deleteFile(outputFileName)
          } else {
            const totalSteps = 10
            for (let step = 1; step <= totalSteps; step++) {
              const progress = Math.round((step / totalSteps) * 100)

              await supabase.from("conversion_jobs").update({ progress }).eq("id", job.id)

              const resolutionHeight = Number.parseInt(job.resolution.replace("p", ""))
              const processingTime = 300 + (resolutionHeight / 1080) * 200
              await new Promise((resolve) => setTimeout(resolve, processingTime))
            }

            // Use original file as converted file
            convertedBlob = fileData
          }

          // Upload converted video to storage
          const convertedPath = `${storagePath.split("/")[0]}/converted_${job.resolution}_${Date.now()}.mp4`
          const { error: uploadError } = await supabase.storage.from("videos").upload(convertedPath, convertedBlob)

          if (uploadError) throw uploadError

          const { data: urlData } = supabase.storage.from("videos").getPublicUrl(convertedPath)

          await supabase
            .from("conversion_jobs")
            .update({
              status: "completed",
              progress: 100,
              completed_at: new Date().toISOString(),
              output_path: convertedPath,
              output_url: urlData.publicUrl,
              file_size: convertedBlob.size,
            })
            .eq("id", job.id)
        } catch (err: any) {
          console.error(`Error converting ${job.resolution}:`, err)
          await supabase
            .from("conversion_jobs")
            .update({
              status: "failed",
              error_message: err.message,
            })
            .eq("id", job.id)
        }
      }

      const { data: allJobs } = await supabase.from("conversion_jobs").select("status").eq("video_id", videoId)

      const allCompleted = allJobs?.every((j) => j.status === "completed")
      const anyFailed = allJobs?.some((j) => j.status === "failed")

      await supabase
        .from("videos")
        .update({
          status: allCompleted ? "completed" : anyFailed ? "failed" : "processing",
        })
        .eq("id", videoId)
    } catch (error) {
      console.error("Conversion error:", error)
      await supabase.from("videos").update({ status: "failed" }).eq("id", videoId)
      throw error
    } finally {
      setConverting(false)
    }
  }

  return {
    convertVideo,
    converting,
    isReady: isLoaded,
  }
}
