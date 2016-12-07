const express = require('express')
const router = express.Router()
const Books = require('../database/db').Books

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bookstore' })
})

/* GET bookDetails */
router.get('/book', function(req, res, next) {
  Books.get(5)
  .then(result => {

    res.render('bookDetails', { book: result});
  })
})

module.exports = router;
