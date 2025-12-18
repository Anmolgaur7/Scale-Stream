-- Enable realtime for videos table
ALTER PUBLICATION supabase_realtime ADD TABLE videos;

-- Enable realtime for conversion_jobs table
ALTER PUBLICATION supabase_realtime ADD TABLE conversion_jobs;
