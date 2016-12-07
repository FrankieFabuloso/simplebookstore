  const connectionString = `postgres://${process.env.USER}@localhost:5432/${process.env.DBNAME}`

  const pgp = require('pg-promise')()
  const db = pgp(connectionString)

  const getBook = 'SELECT * FROM books WHERE id = $1'

  const getAuthors = 'SELECT * FROM authors JOIN book_authors ON author_id=authors.id WHERE book_id=$1'

  const getGenres = 'SELECT * FROM genres JOIN book_genres ON genre_id=genres.id WHERE book_id=$1'

  const Books = {
    getBook: (id) => db.one( getBook, [id] )
      .then( oneBook => {
        return Promise.all([Books.getAuthors(id), Books.getGenres(id), oneBook])
      })
      .then( results => {
        const authors = results[0]
        const genres = results[1]
        const actualBook = results[2]
        actualBook.authors = authors
        actualBook.genres = genres
        return actualBook
      }),
    getAuthors: (book_id) => db.any( getAuthors, [book_id]),
    getGenres: (book_id) => db.any( getGenres, [book_id]),
  }

module.exports = {Books}
