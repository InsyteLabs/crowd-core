
SELECT
    id,
    event_id,
    text,
    hidden,
    user_id

FROM
    event.question

WHERE
    id=$1;