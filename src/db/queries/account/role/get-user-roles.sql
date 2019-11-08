
SELECT
    COALESCE(json_agg(R.name) FILTER (WHERE R.name IS NOT NULL), '[]'::json) AS roles

FROM
    account.user_role AS UR

LEFT JOIN
    account.role AS R ON R.id = UR.role_id

WHERE user_id=$1;