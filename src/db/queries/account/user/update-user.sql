
UPDATE account.user

SET 
    first_name=$2,
    last_name=$3,
    email=$4,
    username=$5,
    is_disabled=$6,
    disabled_comment=$7

WHERE id=$1

RETURNING
    id,
    client_id,
    first_name,
    last_name,
    email,
    username,
    password,
    is_disabled,
    disabled_comment;
