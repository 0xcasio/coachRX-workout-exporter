-- Create exercise_metadata table to store muscle targeting information
-- This table stores AI-generated metadata about exercises to avoid redundant API calls

CREATE TABLE IF NOT EXISTS exercise_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_name TEXT NOT NULL UNIQUE,
  primary_muscles TEXT[] NOT NULL,
  secondary_muscles TEXT[],
  exercise_type TEXT, -- e.g., "Compound", "Isolation", "Cardio", "Mobility"
  benefits TEXT[], -- e.g., ["Strength", "Hypertrophy", "Power", "Endurance", "Mobility"]
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by exercise name
CREATE INDEX IF NOT EXISTS idx_exercise_metadata_name ON exercise_metadata(exercise_name);

-- Enable Row Level Security
ALTER TABLE exercise_metadata ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read exercise metadata (it's public information)
CREATE POLICY "Anyone can read exercise metadata"
  ON exercise_metadata FOR SELECT
  USING (true);

-- Note: Insert/Update operations will be done server-side via service role key
-- No client-side write access needed
