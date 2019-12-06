
SELECT
      id
    , name
    , max_events
    , max_event_viewers
FROM
    account.client_type
WHERE
    id=$1;