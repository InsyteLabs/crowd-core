
/*
    ==============
    ACCOUNT SCHEMA
    ==============
*/
CREATE SCHEMA account;

CREATE TABLE account.user (
    id               serial       NOT NULL PRIMARY KEY,
    client_id        int,
    first_name       varchar(50),
    last_name        varchar(50),
    email            varchar(75),
    username         varchar(50),
    password         varchar(50),
    is_disabled      boolean      DEFAULT false,
    disabled_comment text
);

INSERT INTO account.user
    (first_name, last_name, email, username)
VALUES
    ('Bryce', 'Jech', 'bryce@brycejech.com', 'pyguy');

CREATE TABLE account.role (
    id   serial      NOT NULL PRIMARY KEY,
    name varchar(50)
);

CREATE TABLE account.user_role (
    user_id int REFERENCES account.user(id),
    role_id int REFERENCES account.role(id)
);

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

CREATE TABLE account.type (
    id   serial      NOT NULL PRIMARY KEY,
    name varchar(50)
);

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

CREATE TABLE event.question (
    id         serial NOT NULL PRIMARY KEY,
    event_id   int    NOT NULL REFERENCES event.event(id),
    text       text,
    hidden     boolean DEFAULT false,
    created_by int
);