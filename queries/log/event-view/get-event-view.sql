
SELECT
      EV.id
    , EV.code
    , EV.time

    , EV.event_id
    , E.title     AS event_title
    , E.slug      AS event_slug

    , EV.user_id
    , U.first_name   AS user_first_name
    , U.last_name    AS user_last_name
    , U.username     AS user_username
    , U.email        AS user_email
    , U.is_anonymous AS user_is_anonymous
    , U.is_disabled  AS user_is_disabled

    , EV.client_id
    , C.name       AS client_name
    , C.slug       AS client_slug

FROM log.event_view AS EV

INNER JOIN account.client AS C ON C.id=EV.client_id
INNER JOIN account.user   AS U ON U.id=EV.user_id
INNER JOIN event.event    AS E ON E.id=EV.event_id

WHERE EV.id=$1;