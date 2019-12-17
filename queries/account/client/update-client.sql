
UPDATE account.client

SET
    name             = $2,
    slug             = $3,
    owner_id         = $4,
    type_id          = $5,
    is_disabled      = $6,
    disabled_comment = $7

WHERE
    id=$1

RETURNING
    id,
    name,
    slug,
    owner_id,
    type_id,
    is_disabled,
    disabled_comment;
