
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
	
LEFT JOIN LATERAL (
		SELECT
			  T.name
			, CT.client_id
	
		FROM account.type AS T

		LEFT JOIN (
				SELECT
					type_id,
					client_id
				FROM
					account.client_type
				WHERE
					-- Lateral join so we can get at C.id from here
					client_id=C.id
		) AS CT on CT.type_id=T.id
	
) AS T ON T.client_id=C.id

GROUP BY C.id;