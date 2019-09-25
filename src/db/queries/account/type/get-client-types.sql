
SELECT
    CLIENT_TYPE.type_id AS id,
    TYPE.name
FROM
    account.client_type AS CLIENT_TYPE
LEFT JOIN
    account.type AS TYPE on TYPE.id=CLIENT_TYPE.type_id
WHERE CLIENT_TYPE.client_id=$1;