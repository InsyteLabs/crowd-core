
INSERT INTO account.client
(
      name
    , slug
    , owner_id
    , type_id
)

VALUES
(
      $1
    , $2
    , $3
    , $4
)

RETURNING
      id
    , name
    , slug
    , owner_id
    , type_id
    , is_disabled
    , disabled_comment;