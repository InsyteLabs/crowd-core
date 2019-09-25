
UPDATE event.question SET
    user_id=$2,
    text=$3,
    hidden=$4

WHERE
    event_id=$1

RETURNING
    event_id,
    user_id,
    text,
    hidden;