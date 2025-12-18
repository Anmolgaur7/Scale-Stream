-- Add output_url field to conversion_jobs for storing public URLs
ALTER TABLE conversion_jobs ADD COLUMN IF NOT EXISTS output_url TEXT;
