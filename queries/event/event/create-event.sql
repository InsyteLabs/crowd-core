
INSERT INTO event.event
(
      client_id
    , title
    , slug
    , slug_id
    , description
    , start_time
    , end_time
)

VALUES
(
      $1
    , $2
    , $3
    , $4
    , $5
    , $6
    , $7
)

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
