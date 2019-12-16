
ALTER TABLE event.question

ADD COLUMN IF NOT EXISTS moderator_response text,
ADD COLUMN IF NOT EXISTS moderator_id       int   REFERENCES account.user(id);