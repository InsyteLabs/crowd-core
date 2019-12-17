
DELETE FROM
    event.question

WHERE
    event_id=$1

RETURNING
    id,
    event_id,
    text,
    hidden,
    user_id