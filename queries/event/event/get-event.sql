
SELECT
	  E.id
	, E.client_id
	, E.title
	, E.slug
	, E.slug_id
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
	, COALESCE(COUNT(V), 0)::int AS views
    
FROM
    event.event AS E
	
LEFT JOIN setting.event  AS S ON S.event_id=E.id
LEFT JOIN log.event_view AS V ON V.event_id=E.id

WHERE E.id=$1

GROUP BY
	  E.id
	, S.id

ORDER BY
	is_active    DESC,
	E.start_time DESC;