CREATE TABLE folders(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL
);

CREATE TABLE notes(
    id serial,
    note_name TEXT NOT NULL,
    modified TIMESTAMP NOT NULL,
    folder_id TEXT,
    content TEXT NOT NULL
);