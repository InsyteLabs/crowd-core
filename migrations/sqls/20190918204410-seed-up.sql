
/*
    ==============
    ACCOUNT SCHEMA
    ==============
*/
CREATE SCHEMA account;



-- USER TABLE
CREATE TABLE account.user (
    id               serial       NOT NULL PRIMARY KEY,
    client_id        int,
    first_name       varchar(50),
    last_name        varchar(50),
    email            varchar(75)  NOT NULL,
    username         varchar(50)  NOT NULL UNIQUE,
    password         char(60),
    is_disabled      boolean      DEFAULT false,
    disabled_comment text
);



-- ROLE TYPES
CREATE TABLE account.role (
    id   serial      NOT NULL PRIMARY KEY,
    name varchar(50)
);



-- APPLIED USER ROLES
CREATE TABLE account.user_role (
    user_id int REFERENCES account.user(id),
    role_id int REFERENCES account.role(id)
);



-- CLIENT TABLE
CREATE TABLE account.client (
    id               serial       NOT NULL PRIMARY KEY,
    name             varchar(50),
    slug             varchar(50),
    owner_id         int,
    is_disabled      boolean      DEFAULT false,
    disabled_comment text
);

INSERT INTO account.client
    (name, slug, owner_id)
VALUES
    ('InsyteLabs', 'InsyteLabs', 1);



-- CLIENT TYPE TABLE
CREATE TABLE account.type (
    id   serial      NOT NULL PRIMARY KEY,
    name varchar(50)
);



-- APPLIED CLIENT TYEPS
CREATE TABLE account.client_type (
    client_id int REFERENCES account.client(id),
    type_id   int REFERENCES account.type(id)
);





/*
    ============
    EVENT SCHEMA
    ============
*/
CREATE SCHEMA event;



-- EVENT TABLE
CREATE TABLE event.event (
    id           serial       NOT NULL PRIMARY KEY,
    client_id    int          REFERENCES account.client(id),
    title        varchar(75),
    slug         varchar(75),
    description  text,

    start_time   timestamp with time zone DEFAULT (now() at time zone 'utc'),
    end_time     timestamp with time zone
);

INSERT INTO event.event
    (client_id, title, slug, description, end_time)
VALUES
    (
        1,
        'The First CrowdCore Event',
        'the-first-crowdcore-event',
        'Our very first event to ever be created',
        now() at time zone 'utc' + (1 * interval '1 day')
    );



-- EVENT SETTINGS TABLE
CREATE TABLE event.setting (
    id               serial   NOT NULL PRIMARY KEY,
    event_id         int      NOT NULL REFERENCES event.event(id),
    is_locked        boolean  DEFAULT False,
    require_password boolean  DEFAULT False,
    require_login    boolean  DEFAULT False,
    enable_chat      boolean  DEFAULT True
);

INSERT INTO event.setting (event_id)
VALUES (1);



-- EVENT CHAT TABLE
CREATE TABLE event.chat (
    id       serial  NOT NULL PRIMARY KEY,
    event_id int     NOT NULL REFERENCES event.event(id),
    text     text    NOT NULL,
    user_id  int     NOT NULL REFERENCES account.user(id),
    hidden   boolean DEFAULT False
);



-- EVENT QUESTIONS TABLE
CREATE TABLE event.question (
    id         serial   NOT NULL PRIMARY KEY,
    event_id   int      NOT NULL REFERENCES event.event(id),
    text       text,
    hidden     boolean  DEFAULT false,
    user_id    int      NOT NULL REFERENCES account.user(id)
);



-- QUESTION VOTES TABLE
CREATE TABLE event.vote (
    id          serial  NOT NULL PRIMARY KEY,
    event_id    int     NOT NULL REFERENCES event.event(id),
    question_id int     NOT NULL REFERENCES event.question(id),
    value       int     NOT NULL,
    user_id     int     NOT NULL REFERENCES account.user(id)
);