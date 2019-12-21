
-- Add new max_registered_users column
ALTER TABLE IF EXISTS account.client_type

ADD COLUMN IF NOT EXISTS max_registered_users int;

-- Populate values
UPDATE
	account.client_type
SET
    max_registered_users =  CASE
                                WHEN name='Demo'     THEN 1
								WHEN name='Standard' THEN 25
								WHEN name='Pro'      THEN 100
								WHEN name='Elite'    THEN 500
								WHEN name='Ultimate' THEN 1000
							END;

-- Add not null constraint
ALTER TABLE IF EXISTS account.client_type

ALTER COLUMN max_registered_users SET NOT NULL;
