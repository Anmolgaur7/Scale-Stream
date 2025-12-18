import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { VideoUpload } from "@/components/dashboard/video-upload"
import { VideoListRealtime } from "@/components/dashboard/video-list-realtime"
import { FFmpegStatus } from "@/components/dashboard/ffmpeg-status"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-balance">Your Videos</h1>
              <p className="text-muted-foreground text-pretty">Upload and convert videos to multiple resolutions</p>
            </div>
            <FFmpegStatus />
          </div>
        </div>

        <div className="mb-8">
          <VideoUpload userId={user.id} />
        </div>

        <VideoListRealtime userId={user.id} />
      </main>
    </div>
  )
}
