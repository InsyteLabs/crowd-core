-- Drop the type & client_type tables
DROP TABLE IF EXISTS account.client_type;
DROP TABLE IF EXISTS account.type;

-- Re-Create client_type
CREATE TABLE IF NOT EXISTS account.client_type (
    id    serial       NOT NULL PRIMARY KEY,
    name  varchar(50)  NOT NULL,

    max_events         int  NOT NULL,
    max_event_viewers  int  NOT NULL
);

-- Populate client_type
INSERT INTO account.client_type
    ( name, max_events, max_event_viewers )
VALUES
    ( 'Demo',     1,   10   ),
    ( 'Standard', 10,  100  ),
    ( 'Pro',      25,  250  ),
    ( 'Elite',    50,  500  ),
    ( 'Ultimate', 100, 1000 );

-- Add type_id col
ALTER TABLE account.client
ADD COLUMN type_id int REFERENCES account.client_type(id);

-- Update table so constraint can be added
UPDATE
	account.client
SET
	type_id=1;
	
-- Add NOT NULL constraint
ALTER TABLE account.client
ALTER COLUMN type_id SET NOT NULL;