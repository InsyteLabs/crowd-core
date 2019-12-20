
SELECT
    EXISTS (
        SELECT
            1
        FROM
            event.event
        WHERE
            slug_id=$1 || '_' || $2
    );