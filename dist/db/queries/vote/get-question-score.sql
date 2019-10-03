
SELECT
    COUNT(CASE WHEN value=1  THEN 1 ELSE NULL END)::integer AS upvotes,
    COUNT(CASE WHEN value=-1 THEN 1 ELSE NULL END)::integer AS downvotes,
    COUNT(1)::integer                                       AS votes,
    COALESCE(SUM(value), 0)::integer                        AS score

FROM
    event.vote

WHERE
        event_id=$1
    AND question_id=$2

LIMIT 1;