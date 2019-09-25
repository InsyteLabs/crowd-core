
SELECT
    USER_ROLE.role_id AS id,
    ROLE_TYPE.name
FROM
    account.user_role AS USER_ROLE
LEFT JOIN
    account.role AS ROLE_TYPE ON ROLE_TYPE.id = USER_ROLE.role_id
WHERE user_id=$1