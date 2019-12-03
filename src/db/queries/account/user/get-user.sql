
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
	, COALESCE(json_agg(R.name) FILTER (WHERE R.name IS NOT NULL), '[]'::json) as roles
	, L.time AS last_login

FROM
	account.user AS U
	
LEFT JOIN account.user_role AS UR ON UR.user_id=U.id
LEFT JOIN account.role      AS R  ON R.id=UR.role_id


LEFT JOIN log.auth AS L ON L.id = (
	SELECT id FROM log.auth WHERE user_id=U.id ORDER BY time DESC LIMIT 1
)


WHERE U.id=$1

GROUP BY U.id, L.time

ORDER BY U.last_name ASC;