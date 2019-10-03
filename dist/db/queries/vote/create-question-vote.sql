
INSERT INTO event.vote
(
    event_id,
    question_id,
    user_id,
    value
)

VALUES
(
    $1,
    $2,
    $3,
    $4
)

RETURNING
    id,
    event_id,
    question_id,
    value,
    user_id;