
UPDATE account.client_type

SET
      name                 = $2
    , max_events           = $3
    , max_event_viewers    = $4
    , max_registered_users = $5

WHERE
    id=$1

RETURNING
      id
    , name
    , max_events
    , max_event_viewers
    , max_registered_users;