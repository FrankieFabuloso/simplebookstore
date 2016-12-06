DROP TABLE IF EXISTS books;
CREATE TABLE IF NOT EXISTS books(
  id SERIAL PRIMARY KEY,
  title VARCHAR(512),
  description TEXT,
  large_image_url VARCHAR(512),
  thumbnail_image_url VARCHAR(512),
  buy_link VARCHAR(512),
  average_rating DECIMAL,
  ratings_count INTEGER,
  list_price DECIMAL,
  published_at VARCHAR(32),
  page_count INTEGER
);

DROP TABLE IF EXISTS authors;
CREATE TABLE IF NOT EXISTS authors(
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS genres;
CREATE TABLE IF NOT EXISTS genres(
  id SERIAL PRIMARY KEY,
  name VARCHAR(256) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS book_authors;
CREATE TABLE IF NOT EXISTS book_authors(
  book_id INTEGER,
  author_id INTEGER,
  PRIMARY KEY(book_id, author_id)
);

DROP TABLE IF EXISTS book_genres;
CREATE TABLE IF NOT EXISTS book_genres(
  book_id INTEGER,
  genre_id INTEGER,
  PRIMARY KEY(book_id, genre_id)
);
