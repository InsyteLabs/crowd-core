SELECT
	C.id,
	C.name,
	C.slug,
	C.owner_id,
	C.is_disabled,
	C.disabled_comment,
	json_agg(TYPES.name) AS types
	
FROM
	account.client AS C
	
INNER JOIN LATERAL (
		SELECT
			T.name,
			CT.client_id
		FROM account.type AS T

		LEFT JOIN (
				SELECT
					type_id,
					client_id
				FROM
					account.client_type
				WHERE
					client_id=C.id
		) AS CT on CT.type_id=T.id
	
) AS TYPES ON TYPES.client_id=C.id

GROUP BY C.id;