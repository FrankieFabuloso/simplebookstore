  const fs = require('fs')

  if(fs.existsSync('.env')) {
    require('dotenv').config()
  }
  const connectionString = process.env.DATABASE_URL
  const pgp = require('pg-promise')()

  const db = pgp(connectionString)

  const getBook = 'SELECT * FROM books WHERE id = $1'

  const getAllBooks = 'SELECT * FROM books LIMIT 50 OFFSET $1'

  const getAuthors = 'SELECT * FROM authors JOIN book_authors ON author_id=authors.id WHERE book_id IN ($1:csv)'

  const getGenres = 'SELECT * FROM genres JOIN book_genres ON genre_id=genres.id WHERE book_id IN ($1:csv)'

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
    getAllBooks: (offset) => db.any( getAllBooks, offset)
      .then( results => {
        const bookIds = results.map(book => book.id)
        const empty = [];
        if(results[0] == null) { return Promise.resolve(results) }
        return Promise.all([results, Books.getAuthors(bookIds), Books.getGenres(bookIds)])
      })
      .then( allBooksInfo => {
        const allAuthors = allBooksInfo[1]
        const allGenres = allBooksInfo[2]
        const allBooks = allBooksInfo[0]
        allBooks.forEach(book => {
          book.authors = allAuthors.filter(author => book.id == author.book_id)
          book.genres = allGenres.filter(genre => book.id == genre.book_id)
        })
        return allBooks
      }),
    getAuthors: (book_id) => db.any( getAuthors, [book_id]),
    getGenres: (book_id) => db.any( getGenres, [book_id]),
  }

module.exports = {Books}
