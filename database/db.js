const fs = require('fs')

if(fs.existsSync('.env')) {
  require('dotenv').config()
}
  console.log(process.env.DATABASE_URL)
  const connectionString = process.env.DATABASE_URL
  const pgp = require('pg-promise')()

  const db = pgp(connectionString)

  const getBook = 'SELECT * FROM books WHERE id = $1'

  const Books = {
    get: (id) => db.one( getBook, [id] )
  }

module.exports = {Books}
