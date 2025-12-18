-- Enable Realtime for videos and conversion_jobs tables
ALTER PUBLICATION supabase_realtime ADD TABLE videos;
ALTER PUBLICATION supabase_realtime ADD TABLE conversion_jobs;

-- Ensure RLS policies allow realtime subscriptions
-- Users can only see their own data in realtime
