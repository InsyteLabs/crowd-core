
UPDATE event.event SET
    client_id=$2,
    title=$3,
    slug=$4,
    description=$5,
    start_time=$6,
    end_time=$7

WHERE
    id=$1

RETURNING *;