
UPDATE account.role SET name=$2 WHERE id=$1 RETURNING id, name;