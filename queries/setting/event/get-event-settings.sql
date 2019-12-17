
SELECT
    id,
    event_id,
    is_locked,
    require_password,
    password,
    require_login,
    enable_chat

FROM
    setting.event

WHERE
    event_id=$1;