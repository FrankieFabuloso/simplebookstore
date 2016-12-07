  const connectionString = `postgres://${process.env.USER}@localhost:5432/${process.env.DBNAME}`

  const pgp = require('pg-promise')()

  const db = pgp(connectionString)

  const getBook = 'SELECT * FROM books WHERE id = $1'

  const Books = {
    get: (id) => db.one( getBook, [id] )
  }

module.exports = {Books}
