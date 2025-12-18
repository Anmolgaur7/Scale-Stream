export interface Video {
  id: string
  user_id: string
  title: string
  original_filename: string
  file_size: number
  duration?: number
  mime_type: string
  storage_path: string
  thumbnail_path?: string
  status: "uploaded" | "processing" | "completed" | "failed"
  created_at: string
  updated_at: string
}

export interface ConversionJob {
  id: string
  video_id: string
  resolution: "1080p" | "720p" | "480p" | "360p"
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  output_path?: string
  output_url?: string
  file_size?: number
  error_message?: string
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface VideoWithJobs extends Video {
  conversion_jobs: ConversionJob[]
}
