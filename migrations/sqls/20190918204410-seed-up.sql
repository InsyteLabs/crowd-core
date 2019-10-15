
/*
    ==============
    ACCOUNT SCHEMA
    ==============
*/
CREATE SCHEMA account;

-- USER TABLE
CREATE TABLE account.user (
    id                serial        NOT NULL PRIMARY KEY,
    client_id         int,
    first_name        varchar(50),
    last_name         varchar(50),
    email             varchar(75),
    username          varchar(50)   NOT NULL UNIQUE,
    password          char(60),
    is_anonymous      boolean,
    is_disabled       boolean       DEFAULT false,
    disabled_comment  text
);

-- ROLE TYPES
CREATE TABLE account.role (
    id    serial       NOT NULL PRIMARY KEY,
    name  varchar(50)  NOT NULL UNIQUE
);

-- APPLIED USER ROLES
CREATE TABLE account.user_role (
    user_id  int  REFERENCES account.user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    role_id  int  REFERENCES account.role(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- CLIENT TABLE
CREATE TABLE account.client (
    id                serial        NOT NULL PRIMARY KEY,
    name              varchar(50),
    slug              varchar(50),
    owner_id          int,
    is_disabled       boolean       DEFAULT false,
    disabled_comment  text
);

-- CLIENT TYPE TABLE
CREATE TABLE account.type (
    id    serial       NOT NULL PRIMARY KEY,
    name  varchar(50)
);

-- APPLIED CLIENT TYEPS
CREATE TABLE account.client_type (
    client_id  int  REFERENCES account.client(id) ON DELETE CASCADE ON UPDATE CASCADE,
    type_id    int  REFERENCES account.type(id)   ON DELETE CASCADE ON UPDATE CASCADE
);



/*
    ============
    EVENT SCHEMA
    ============
*/
CREATE SCHEMA event;

-- EVENT TABLE
CREATE TABLE event.event (
    id           serial        NOT NULL PRIMARY KEY,
    client_id    int           REFERENCES account.client(id) ON DELETE CASCADE ON UPDATE CASCADE,
    title        varchar(75),
    slug         varchar(75),
    description  text,

    start_time   timestamp with time zone DEFAULT (now() at time zone 'utc'),
    end_time     timestamp with time zone
);

-- EVENT CHAT TABLE
CREATE TABLE event.chat (
    id        serial   NOT NULL PRIMARY KEY,
    event_id  int      NOT NULL REFERENCES event.event(id)  ON DELETE CASCADE ON UPDATE CASCADE,
    text      text     NOT NULL,
    user_id   int      NOT NULL REFERENCES account.user(id) ON DELETE CASCADE ON UPDATE CASCADE,
    hidden    boolean  DEFAULT False
);

-- EVENT QUESTIONS TABLE
CREATE TABLE event.question (
    id        serial   NOT NULL PRIMARY KEY,
    event_id  int      NOT NULL REFERENCES event.event(id)  ON DELETE CASCADE ON UPDATE CASCADE,
    text      text,
    hidden    boolean  DEFAULT false,
    user_id   int      NOT NULL REFERENCES account.user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- QUESTION VOTES TABLE
CREATE TABLE event.vote (
    id           serial  NOT NULL PRIMARY KEY,
    event_id     int     NOT NULL REFERENCES event.event(id)    ON DELETE CASCADE ON UPDATE CASCADE,
    question_id  int     NOT NULL REFERENCES event.question(id) ON DELETE CASCADE ON UPDATE CASCADE,
    value        int     NOT NULL,
    user_id      int     NOT NULL REFERENCES account.user(id)   ON DELETE CASCADE ON UPDATE CASCADE
);



/*
    ==============
    SETTING SCHEMA
    ==============
*/
CREATE SCHEMA setting;

CREATE TABLE setting.event (
    id                serial        NOT NULL PRIMARY KEY,
    event_id          int           NOT NULL REFERENCES event.event(id) ON DELETE CASCADE ON UPDATE CASCADE,
    is_locked         boolean       DEFAULT False,
    require_password  boolean       DEFAULT False,
    password          varchar(64),
    require_login     boolean       DEFAULT False,
    enable_chat       boolean       DEFAULT True
);