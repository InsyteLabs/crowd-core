
DELETE FROM account.client_type WHERE type_id=$1 AND client_id=$2 RETURNING type_id, client_id;