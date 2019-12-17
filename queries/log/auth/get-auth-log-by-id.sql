
SELECT
      L.id
    , C.id               AS client_id
    , C.name             AS client_name
	, C.slug             AS client_slug
    , U.id               AS user_id
	, U.first_name       AS user_first_name
	, U.last_name        AS user_last_name
	, U.email            AS user_email
    , U.username         AS user_username
	, U.is_anonymous     AS user_is_anonymous
	, U.is_disabled      AS user_is_disabled
	, U.disabled_comment AS user_disabled_comment
    , L.ip
    , L.success
    , L.time

FROM log.auth AS L

LEFT JOIN account.client AS C on C.id=L.client_id
LEFT JOIN account.user   AS U on U.id=L.user_id

WHERE L.id=$1;