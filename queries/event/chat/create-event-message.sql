
INSERT INTO event.chat
(
    event_id,
    user_id,
    text
)

VALUES
(
    $1,
    $2,
    $3
)

RETURNING
    id,
    event_id,
    user_id,
    text,
    hidden;