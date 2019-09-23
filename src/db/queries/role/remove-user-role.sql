
DELETE FROM account.user_role WHERE role_id=$1 AND user_id=$2 RETURNING *;