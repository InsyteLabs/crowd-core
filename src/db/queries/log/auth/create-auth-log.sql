
INSERT INTO log.auth
(
      client_id
    , user_id
    , ip
    , success
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
    , client_id
    , user_id
    , ip
    , success
    , time
;