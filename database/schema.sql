DROP TABLE IF EXISTS books;
CREATE TABLE IF NOT EXISTS books(
  id SERIAL PRIMARY KEY,
  title VARCHAR(512),
  description TEXT,
  large_image_url VARCHAR(512),
  thumbnail_image_url VARCHAR(512) DEFAULT 'http://www.aobc.com/images/astd/no_book_image.gif',
  buy_link VARCHAR(512) DEFAULT 'https://www.amazon.com/Coding-Dummies-Computers-Nikhil-Abraham/dp/1118951301',
  average_rating DECIMAL DEFAULT 2.5,
  ratings_count INTEGER DEFAULT 0,
  list_price DECIMAL DEFAULT 0,
  published_at VARCHAR(32),
  page_count INTEGER DEFAULT 0
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
  book_id INTEGER REFERENCES books ON DELETE CASCADE,
  author_id INTEGER REFERENCES authors ON DELETE CASCADE,
  PRIMARY KEY(book_id, author_id)
);

DROP TABLE IF EXISTS book_genres;
CREATE TABLE IF NOT EXISTS book_genres(
  book_id INTEGER REFERENCES books ON DELETE CASCADE,
  genre_id INTEGER REFERENCES genres ON DELETE CASCADE,
  PRIMARY KEY(book_id, genre_id)
);
