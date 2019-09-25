
INSERT INTO event.question
(
    event_id,
    text,
    user_id
)

VALUES
(
    $1,
    $2,
    $3
)

RETURNING
    event_id,
    text,
    user_id;
