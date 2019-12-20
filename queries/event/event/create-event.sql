
INSERT INTO event.event
(
    client_id,
    title,
    slug,
    description,
    start_time,
    end_time,
    slug_id
)

VALUES
(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $1::text || '_' || $3
)

RETURNING
    id,
    client_id,
    title,
    slug,
    description,
    start_time,
    end_time,

	CASE WHEN
    (
        start_time < NOW() AND end_time > NOW()
    )
    THEN true ELSE false END AS is_active;
