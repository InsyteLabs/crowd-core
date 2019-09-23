
SELECT
	json_agg(USER_ROLE.name) AS roles

FROM
	(
		SELECT
			ROLE_TYPE.name
		FROM
			account.user_role AS USER_ROLE
		LEFT JOIN
			account.role AS ROLE_TYPE ON ROLE_TYPE.id = USER_ROLE.role_id
		WHERE user_id=$1
	) AS USER_ROLE;