
SELECT
    id,
    client_id,
    title,
    slug,
    description,
    start_time,
    end_time

FROM event.event

WHERE
    client_id=$1;