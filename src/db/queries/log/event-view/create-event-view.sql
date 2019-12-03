INSERT INTO log.event_view (
	  code
	, client_id
	, user_id
	, event_id
	, time
)
VALUES
(
	  $1
	, $2
	, $3
	, $4
	, NOW() AT time zone 'utc'
)

ON CONFLICT (code) DO UPDATE SET time=NOW() AT time zone 'utc'

RETURNING
	  id
	, client_id
	, user_id
	, event_id
	, code
	, time;
