
UPDATE event.chat SET
    text=$2,
    hidden=$3

WHERE
    id=$1

RETURNING
    id,
    event_id,
    user_id,
    text,
    hidden;