
UPDATE account.client

SET
    name             = $2,
    slug             = $3,
    owner_id         = $4,
    is_disabled      = $5,
    disabled_comment = $6

WHERE
    id=$1

RETURNING
    id,
    name,
    slug,
    owner_id,
    is_disabled,
    disabled_comment;
