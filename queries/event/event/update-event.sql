
UPDATE event.event SET
      client_id=$2
    , title=$3
    , slug=$4
    , slug_id=$2::text || '_' || $4
    , description=$5
    , start_time=$6
    , end_time=$7

WHERE
    id=$1

RETURNING
      id
    , client_id
    , title
    , slug
    , description
    , start_time
    , end_time

	, CASE WHEN
      (
          start_time < NOW() AND end_time > NOW()
      )
      THEN true ELSE false END AS is_active;