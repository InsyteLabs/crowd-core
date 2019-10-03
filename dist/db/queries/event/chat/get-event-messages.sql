
SELECT
    id,
    event_id,
    user_id,
    text,
    hidden

FROM
    event.chat

WHERE
    event_id=$1;