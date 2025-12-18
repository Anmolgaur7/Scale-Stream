import { createClient } from "@/lib/supabase/server"
import { VideoCard } from "./video-card"

interface VideoListProps {
  userId: string
}

export async function VideoList({ userId }: VideoListProps) {
  const supabase = await createClient()

  const { data: videos, error } = await supabase
    .from("videos")
    .select(`
      *,
      conversion_jobs (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching videos:", error)
    return <div className="text-destructive">Failed to load videos</div>
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <Video className="mx-auto mb-4 h-16 w-16 text-muted-foreground opacity-50" />
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

function Video({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m10 8 6 4-6 4Z" />
    </svg>
  )
}
