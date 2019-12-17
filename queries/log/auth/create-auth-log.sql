
INSERT INTO log.auth
(
      client_id
    , user_id
    , ip
    , success
    , time
)

VALUES
(
      $1
    , $2
    , $3
    , $4
    , CURRENT_TIMESTAMP
)

RETURNING
      id
    , client_id
    , user_id
    , ip
    , success
    , time
;