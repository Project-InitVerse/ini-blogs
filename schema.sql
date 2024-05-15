DROP TABLE IF EXISTS blogs;
CREATE TABLE IF NOT EXISTS blogs (
  id integer PRIMARY KEY AUTOINCREMENT,
  content text NOT NULL,
  path text NOT NULL,
  metadata text NOT NULL
);