
SELECT
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
    THEN true ELSE false END AS is_active
    
FROM
    event.event

WHERE
    id=$1;