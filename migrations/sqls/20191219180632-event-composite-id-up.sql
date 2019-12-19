
-- Add new slug_id col and add NOT NULL to title/slug
ALTER TABLE IF EXISTS event.event

ADD COLUMN IF NOT EXISTS slug_id varchar(85) UNIQUE,

ALTER COLUMN title SET NOT NULL,
ALTER COLUMN slug SET NOT NULL;


-- Populate new slug_id col
UPDATE event.event SET slug_id = client_id || '_' || slug;


-- Set NOT NULL constraint on slug_id
ALTER TABLE IF EXISTS event.event

ALTER COLUMN slug_id SET NOT NULL;