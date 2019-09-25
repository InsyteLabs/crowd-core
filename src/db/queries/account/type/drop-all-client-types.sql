
DELETE FROM account.client_type WHERE client_id=$1 RETURNING *;