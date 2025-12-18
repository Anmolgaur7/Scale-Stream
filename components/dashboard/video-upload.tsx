"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Video, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface VideoUploadProps {
  userId: string
}

export function VideoUpload({ userId }: VideoUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("video/")) {
        setError("Please select a valid video file")
        return
      }
      setFile(selectedFile)
      setError(null)
      // Auto-fill title from filename
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""))
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !title) {
      setError("Please select a file and enter a title")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Upload file to Supabase storage
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("videos").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) throw uploadError

      // Create video record in database
      const { data: videoData, error: dbError } = await supabase
        .from("videos")
        .insert({
          user_id: userId,
          title,
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          storage_path: fileName,
          status: "uploaded",
        })
        .select()
        .single()

      if (dbError) throw dbError

      // Create conversion jobs for all resolutions
      const resolutions = ["1080p", "720p", "480p", "360p"]
      const jobInserts = resolutions.map((resolution) => ({
        video_id: videoData.id,
        resolution,
        status: "pending",
        progress: 0,
      }))

      const { error: jobsError } = await supabase.from("conversion_jobs").insert(jobInserts)

      if (jobsError) throw jobsError

      // Reset form
      setFile(null)
      setTitle("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Refresh the page to show new video
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "Failed to upload video")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Upload Video</h2>
          <p className="text-sm text-muted-foreground">Convert to multiple resolutions automatically</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Video Title</Label>
          <Input
            id="title"
            placeholder="Enter a title for your video"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Video File</Label>
          <div className="flex items-center gap-4">
            <Input
              id="file"
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="flex-1"
            />
            {file && (
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <Video className="h-4 w-4 text-primary" />
                <span className="text-sm">{file.name}</span>
              </div>
            )}
          </div>
        </div>

        <Button onClick={handleUpload} disabled={uploading || !file || !title} className="w-full" size="lg">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Upload and Convert
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
