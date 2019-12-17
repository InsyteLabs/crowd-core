
INSERT INTO account.user
(
    client_id,
    first_name,
    last_name,
    email,
    username,
    password,
    is_anonymous
)

VALUES
(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    False
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