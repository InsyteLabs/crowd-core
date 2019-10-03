
INSERT INTO account.client_type (type_id, client_id) VALUES ($1, $2) RETURNING type_id, client_id;