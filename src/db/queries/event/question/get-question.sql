
SELECT
    Q.id,
    Q.event_id,
    Q.user_id,
    Q.text,
    Q.hidden,
    
    U.first_name   AS user_first_name,
    U.last_name    AS user_last_name,
    U.username     AS user_username,
    U.is_anonymous AS user_is_anonymous

FROM
    event.question AS Q

LEFT JOIN account.user AS U on U.id = Q.user_id

WHERE
    Q.id=$1;