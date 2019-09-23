
DELETE FROM account.user_role WHERE user_id=$1 RETURNING *;