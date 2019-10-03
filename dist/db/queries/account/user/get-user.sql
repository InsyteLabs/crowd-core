
SELECT
    id,
    client_id,
    first_name,
    last_name,
    email,
    username,
    password,
    is_disabled,
    disabled_comment
    
FROM
    account.user

WHERE
    id=$1;