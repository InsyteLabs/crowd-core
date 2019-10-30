
DELETE FROM
    account.user

WHERE id=$1

RETURNING
    id,
    client_id,
    first_name,
    last_name,
    email,
    username,
    password,
    is_anonymous,
    is_disabled,
    disabled_comment