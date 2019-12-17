
UPDATE event.question SET
    user_id=$3,
    text=$4,
    hidden=$5

WHERE
        id = $1
    AND event_id = $2

RETURNING
    id,
    event_id,
    user_id,
    text,
    hidden;