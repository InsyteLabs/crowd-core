
SELECT
	  C.id
	, C.name
	, C.slug
	, C.owner_id
	, C.is_disabled
	, C.disabled_comment

	, C.type_id
	, CT.name as type_name
	, CT.max_events
	, CT.max_event_viewers
FROM
	account.client AS C
	
LEFT JOIN account.client_type AS CT ON CT.id=C.type_id;