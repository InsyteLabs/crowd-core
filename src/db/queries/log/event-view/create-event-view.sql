INSERT INTO log.event_view (
	  client_id
	, user_id
	, event_id
	, user_event
	, time
)
VALUES
(
	$1, $2, $3, $2 || '_' || $3, NOW()
)

ON CONFLICT (user_event) DO UPDATE SET time=NOW()

RETURNING
	  client_id
	, user_id
	, event_id
	, user_event
	, time;
