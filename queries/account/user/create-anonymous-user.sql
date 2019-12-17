
INSERT INTO account.user
(
    client_id,
    username,
    is_anonymous
)

VALUES
(
    $1,
    $2,
    True
)

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
    disabled_comment;