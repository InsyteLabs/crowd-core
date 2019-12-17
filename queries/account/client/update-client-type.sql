
UPDATE account.client_type

SET
      name              = $2
    , max_events        = $3
    , max_event_viewers = $4

WHERE
    id=$1

RETURNING
      id
    , name
    , max_events
    , max_event_viewers;