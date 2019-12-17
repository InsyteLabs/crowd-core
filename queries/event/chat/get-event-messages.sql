
SELECT
    chat.id,
    chat.event_id,
    chat.user_id,
    user_table.first_name   AS user_first_name,
    user_table.last_name    AS user_last_name,
    user_table.username     AS user_username,
    user_table.is_anonymous AS user_is_anonymous,
    chat.text,
    chat.hidden


FROM
    event.chat AS chat
	
LEFT JOIN account.user AS user_table ON chat.user_id = user_table.id
	

WHERE
    event_id=$1

ORDER BY
    chat.id ASC;