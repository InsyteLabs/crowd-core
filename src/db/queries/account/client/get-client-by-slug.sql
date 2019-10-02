
SELECT
    id,
    name,
    slug,
    owner_id,
    is_disabled,
    disabled_comment

FROM
    account.client

WHERE
    slug=$1

LIMIT 1;