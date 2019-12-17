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
	, CURRENT_TIMESTAMP
)

ON CONFLICT (code) DO UPDATE SET time=CURRENT_TIMESTAMP

RETURNING
	  id
	, client_id
	, user_id
	, event_id
	, code
	, time;
