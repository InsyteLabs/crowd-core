SELECT
	  U.id
	, U.client_id
	, U.first_name
	, U.last_name
	, U.email
	, U.username
	, U.password
	, U.is_anonymous
	, U.is_disabled
	, U.disabled_comment
	, COALESCE(json_agg(R.name) FILTER (WHERE R.name IS NOT NULL), '[]'::json) AS roles

FROM
	account.user AS U
	
LEFT JOIN LATERAL (
	SELECT
		  AR.name
		, UR.user_id
	FROM
		account.user_role AS UR
	LEFT JOIN
		account.role AS AR ON AR.id=UR.role_id
	WHERE
		UR.user_id=U.id
) AS R ON R.user_id=U.id

GROUP BY U.id;