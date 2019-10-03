
INSERT INTO setting.event
(
    event_id,
    is_locked,
    require_password,
    password,
    require_login,
    enable_chat
)

VALUES
(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
)

RETURNING
    id,
    event_id,
    is_locked,
    require_password,
    password,
    require_login,
    enable_chat;