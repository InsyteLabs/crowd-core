
SELECT
    COALESCE(json_agg(TYPE.name) FILTER (WHERE TYPE.name IS NOT NULL), '[]'::json) as types
FROM
    account.client_type AS CLIENT_TYPE
    
LEFT JOIN
    account.type AS TYPE on TYPE.id=CLIENT_TYPE.type_id

WHERE CLIENT_TYPE.client_id=$1;