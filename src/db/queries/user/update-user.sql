
UPDATE account.user

SET 
    first_name=$2,
    last_name=$3,
    email=$4,
    username=$5,
    password=$6,
    is_disabled=$7,
    disabled_comment=$8

WHERE id=$1

RETURNING *;
