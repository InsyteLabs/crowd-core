
SELECT
    id,
    event_id,
    text,
    hidden,
    user_id

FROM
    event.question

WHERE
    event_id=$1;