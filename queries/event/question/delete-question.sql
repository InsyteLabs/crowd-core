
DELETE FROM
    event.question

WHERE
    id=$1

RETURNING
    id,
    event_id,
    user_id,
    text,
    hidden;