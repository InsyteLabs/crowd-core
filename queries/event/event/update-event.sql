
UPDATE event.event SET
      title=$2
    , slug=$3
    , slug_id=$4
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