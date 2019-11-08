
SELECT
	  C.id
	, C.name
	, C.slug
	, C.owner_id
	, C.is_disabled
	, C.disabled_comment
	, COALESCE(json_agg(T.name) FILTER (WHERE T.name IS NOT NULL), '[]'::json) AS types
	
FROM
	account.client AS C
	
LEFT JOIN account.client_type AS CT ON CT.client_id=C.id
LEFT JOIN account.type        AS T  ON T.id=CT.type_id

GROUP BY C.id;