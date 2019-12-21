
WITH client_events AS (
	SELECT
		  C.id
		, COUNT(1)::int AS total_events
		, COUNT(
			CASE WHEN E.start_time < NOW() AND E.end_time > NOW() THEN 1 ELSE NULL END
		)::int AS active_events

	FROM
		event.event AS E

	INNER JOIN account.client AS C ON C.id=E.client_id

	WHERE
		C.id=$1

	GROUP BY
		C.id

	LIMIT 1
), 

client_users AS (
	SELECT
		  C.id
		, COUNT(
			  CASE WHEN U.is_anonymous=True THEN 1 ELSE NULL END
		  )::int AS anonymous_user_count
		, COUNT(
			  CASE WHEN U.is_anonymous=False THEN 1 ELSE NULL END
		  )::int AS user_count
		, COUNT(1)::int AS total_users

	FROM
		account.user AS U

	INNER JOIN account.client AS C ON C.id=U.client_id

	WHERE
		C.id=$1

	GROUP BY
		C.id

	LIMIT 1
)

SELECT
	  C.id
	, C.name
	, C.slug
	, C.is_disabled
	, C.disabled_comment

	, C.owner_id
	, U.first_name       AS owner_first_name
	, U.last_name        AS owner_last_name
	, U.email            AS owner_email
	, U.username         AS owner_username
	, U.is_anonymous     AS owner_is_anonymous
	, U.is_disabled      AS owner_is_disabled
	, U.disabled_comment AS owner_disabled_comment

	, C.type_id
	, CT.name AS type_name
	, CT.max_events
	, CT.max_event_viewers

	, CE.total_events
	, CE.active_events
	, CU.anonymous_user_count
	, CU.user_count
	, CU.total_users

FROM
	account.client AS C

INNER JOIN account.user AS U ON U.id=C.owner_id
INNER JOIN account.client_type AS CT ON CT.id=C.type_id
INNER JOIN client_events AS CE ON CE.id=C.id
INNER JOIN client_users AS CU ON CU.id=C.id

WHERE
	C.id=$1

LIMIT 1;