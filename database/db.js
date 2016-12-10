  const fs = require('fs')

  if(fs.existsSync('.env')) {
    require('dotenv').config()
  }
  const connectionString = process.env.DATABASE_URL
  const pgp = require('pg-promise')()

  const db = pgp(connectionString)

  const getBook = 'SELECT * FROM books WHERE id = $1'

  const getAllBooks = 'SELECT * FROM books LIMIT 12 OFFSET $1'

  const getAuthors = 'SELECT * FROM authors JOIN book_authors ON author_id=authors.id WHERE book_id IN ($1:csv)'

  const getGenres = 'SELECT * FROM genres JOIN book_genres ON genre_id=genres.id WHERE book_id IN ($1:csv)'

  const deleteBook = 'DELETE FROM books WHERE id = $1'

  const addBook = 'INSERT INTO books(id, title, description, thumbnail_image_url, buy_link, list_price, published_at, page_count) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7) RETURNING *'

  const addAuthor = "INSERT INTO authors(id, name) VALUES (DEFAULT, $1) ON CONFLICT DO NOTHING; INSERT INTO book_authors(book_id, author_id) VALUES($2,( SELECT currval('authors_id_seq'))) ON CONFLICT DO NOTHING RETURNING *"

  const addGenre = "INSERT INTO genres(id, name) VALUES (DEFAULT, $1) ON CONFLICT DO NOTHING; INSERT INTO book_genres(book_id, genre_id) VALUES($2,( SELECT currval('genres_id_seq'))) ON CONFLICT DO NOTHING RETURNING *"

  const getLastBook = "SELECT MAX(id) FROM books"

  const Books = {
    addBook: (parameters) => {
      let {title, description, imgUrl, buyLink, listPrice, publishDate, pageCount} = parameters
      listPrice = parseFloat(listPrice)
      pageCount = parseInt(pageCount)
      if(buyLink === ''){
        buyLink = 'https://www.amazon.com/Coding-Dummies-Computers-Nikhil-Abraham/dp/1118951301'
      }
      if(imgUrl === ''){
        imgUrl = 'http://www.aobc.com/images/astd/no_book_image.gif'
      }
      return db.one(addBook, [title, description, imgUrl, buyLink, listPrice, publishDate, pageCount])
      .then( addedBook => {
        const result = addedBook
        const bookId = addedBook.id
        let {author, genre} = parameters
        const authorArray = []
        const genreArray = []
        if(!Array.isArray(author)) {
          author = [author]
        }
        if(!Array.isArray(genre)){
          genre = [genre]
        }
        if(author.length != 0){
          author.forEach( author => authorArray.push(Books.addAuthors(author, bookId)) )
        }
        if(genre.length != 0){
          genre.forEach( genre => genreArray.push(Books.addGenres(genre, bookId)) )
        }
        // console.log('AuthorArray',authorArray);
        // console.log('GenreArray',genreArray);
        return Promise.all([Promise.all(authorArray), Promise.all(genreArray), result])
      })
      .then( results => {
        const authors = results[0].name
        console.log("Authors",authors)
        return results
      })
    },
    addAuthors: (author, bookId) => db.one( addAuthor, [author, bookId]),
    addGenres: (genre, bookId) => db.one( addGenre, [genre, bookId]),
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
    deleteBook: (book_id) => db.none( deleteBook, [book_id]),
    lastBook: () => db.one(getLastBook)
      .then(maxid => Books.getBook(maxid.max))
  }

module.exports = {Books}
