
/*
    ==============
    ACCOUNT SCHEMA
    ==============
*/
CREATE SCHEMA account;

CREATE TABLE account.user (
    id              serial       NOT NULL PRIMARY KEY,
    clientId        int,
    firstName       varchar(50),
    lastName        varchar(50),
    email           varchar(75),
    username        varchar(50),
    password        varchar(50),
    isDisabled      boolean      DEFAULT false,
    disabledComment text
);

INSERT INTO account.user
    (firstName, lastName, email, username)
VALUES
    ('Bryce', 'Jech', 'bryce@brycejech.com', 'pyguy');

CREATE TABLE account.role (
    id   serial      NOT NULL PRIMARY KEY,
    name varchar(50)
);

CREATE TABLE account.user_role (
    userId int REFERENCES account.user(id),
    roleId int REFERENCES account.role(id)
);

CREATE TABLE account.client (
    id              serial       NOT NULL PRIMARY KEY,
    name            varchar(50),
    slug            varchar(50),
    ownerId         int,
    isDisabled      boolean      DEFAULT false,
    disabledComment text
);

INSERT INTO account.client
    (name, slug, ownerId)
VALUES
    ('InsyteLabs', 'InsyteLabs', 1);

CREATE TABLE account.type (
    id   serial      NOT NULL PRIMARY KEY,
    name varchar(50)
);

CREATE TABLE account.client_type (
    clientId int REFERENCES account.client(id),
    typeId   int REFERENCES account.type(id)
);


/*
    ============
    EVENT SCHEMA
    ============
*/
CREATE SCHEMA event;

CREATE TABLE event.event (
    id          serial       NOT NULL PRIMARY KEY,
    clientId    int          REFERENCES account.client(id),
    title       varchar(75),
    slug        varchar(75),
    description text,

    start_time  timestamp with time zone DEFAULT (now() at time zone 'utc'),
    end_time    timestamp with time zone
);

INSERT INTO event.event
    (clientId, title, slug, description, end_time)
VALUES
    (
        1,
        'The First CrowdCore Event',
        'the-first-crowdcore-event',
        'Our very first event to ever be created',
        now() at time zone 'utc' + (1 * interval '1 day')
    );

CREATE TABLE event.question (
    id        serial NOT NULL PRIMARY KEY,
    eventId   int    NOT NULL REFERENCES event.event(id),
    text      text,
    hidden    boolean DEFAULT false,
    createdBy int
);