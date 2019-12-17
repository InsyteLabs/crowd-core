
INSERT INTO account.client_type
(
      name
    , max_events
    , max_event_viewers
)

VALUES
(
      $1
    , $2
    , $3
)

RETURNING
      id
    , name
    , max_events
    , max_event_viewers;