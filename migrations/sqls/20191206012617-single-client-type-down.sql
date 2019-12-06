
ALTER TABLE account.client
DROP COLUMN type_id;

CREATE TABLE IF NOT EXISTS account.type (
    id    serial      NOT NULL PRIMARY KEY,
    name  varchar(50) NOT NULL
);

INSERT INTO account.type
    ( name )
VALUES
    ( 'Demo'     ),
    ( 'Standard' ),
    ( 'Pro'      ),
    ( 'Elite'    ),
    ( 'Ultimate' );

DROP TABLE IF EXISTS account.client_type;

CREATE TABLE IF NOT EXISTS account.client_type (
    client_id  int  REFERENCES account.client(id) ON DELETE CASCADE ON UPDATE CASCADE,
    type_id    int  REFERENCES account.type(id)   ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO account.client_type
    ( client_id, type_id )
SELECT
    id, 1
FROM account.client;