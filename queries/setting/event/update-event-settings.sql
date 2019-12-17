
UPDATE setting.event SET
    is_locked=$2,
    require_password=$3,
    password=$4,
    require_login=$5,
    enable_chat=$6

WHERE
    event_id=$1

RETURNING
    id,
    event_id,
    is_locked,
    require_password,
    password,
    require_login,
    enable_chat;