
INSERT INTO account.client_type
(
      name
    , max_events
    , max_event_viewers
    , max_registered_users
)

VALUES
(
      $1
    , $2
    , $3
    , $4
)

RETURNING
      id
    , name
    , max_events
    , max_event_viewers
    , max_registered_users;