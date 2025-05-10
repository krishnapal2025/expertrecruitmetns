-- Migration to fix the employer_id constraint issue on jobs table

-- Drop NOT NULL constraint on employer_id column if it exists
ALTER TABLE "jobs" ALTER COLUMN "employer_id" DROP NOT NULL;

-- Add comment to document the change
COMMENT ON COLUMN "jobs"."employer_id" IS 'Reference to employer table, made optional to allow direct company name entry';