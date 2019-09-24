
INSERT INTO event.event
(
    client_id,
    title,
    slug,
    description,
    start_time,
    end_time
)

VALUES
(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
)

RETURNING *;
