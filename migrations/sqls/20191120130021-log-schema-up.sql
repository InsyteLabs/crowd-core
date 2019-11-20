
/*
    ==========
    LOG SCHEMA
    ==========
*/
CREATE SCHEMA log;

-- AUTH TABLE

CREATE TABLE log.auth (
    id         serial       NOT NULL PRIMARY KEY,
    client_id  int          REFERENCES account.client(id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id    int          REFERENCES account.user(id)   ON DELETE CASCADE ON UPDATE CASCADE,
    ip         varchar(45)  NOT NULL,
    success    boolean      NOT NULL,

    time  timestamp with time zone  DEFAULT (now() at time zone 'utc')
);

CREATE TABLE log.event_view (
    id        serial  NOT NULL PRIMARY KEY,
    client_id int     REFERENCES account.client(id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id   int     REFERENCES account.user(id)   ON DELETE CASCADE ON UPDATE CASCADE,
    event_id  int     REFERENCES event.event(id)    ON DELETE CASCADE ON UPDATE CASCADE,

    time  timestamp with time zone  DEFAULT (now() at time zone 'utc')
);