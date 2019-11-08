
SELECT
	  E.id
	, E.client_id
	, E.title
	, E.slug
	, E.description
	, E.start_time
	, E.end_time

	, CASE WHEN
      (
          E.start_time < NOW() AND E.end_time > NOW()
      )
      THEN true ELSE false END AS is_active
	
	, S.id AS settings_id
	, S.is_locked
	, S.require_password
	, S.password
	, S.require_login
	, S.enable_chat
    
FROM
    event.event AS E
	
LEFT JOIN setting.event AS S on S.event_id=E.id

ORDER BY
	is_active    DESC,
	E.start_time DESC;