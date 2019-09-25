
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
    id=$1;