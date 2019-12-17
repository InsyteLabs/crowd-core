
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
	, CT.name as type_name
	, CT.max_events
	, CT.max_event_viewers
FROM
	account.client AS C
	
LEFT JOIN account.user AS U ON U.id=C.owner_id
LEFT JOIN account.client_type AS CT ON CT.id=C.type_id;