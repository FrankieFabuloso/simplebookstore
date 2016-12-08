const express = require('express')
const router = express.Router()
const Books = require('../database/db').Books

/* GET home page. */
router.get('/', function(req, res, next) {
  const randomBooks = []
  const checkForDoubles = []
  for(let i = 0; randomBooks.length < 11; i++){
    let id = Math.floor( Math.random()*1000)
    if(checkForDoubles.indexOf(id) === -1) {
      randomBooks.push(Books.getBook(id))
      checkForDoubles.push(id)
    }
  }
  console.log(randomBooks.length);
  Promise.all(randomBooks)
  .then( result => {
    res.render('index', { books: result })
  })
})

/* GET bookDetails */
router.get('/book/:id', function(req, res, next) {
  const id = req.params.id
  Books.getBook(id)
  .catch(error => {
    console.log(error);
    res.redirect('/')
  })
  .then(result => {
    res.render('bookDetails', { book: result});
  })
})

router.get('/admin', function(req, res, next) {
  const page = req.query.page || 1
  const offset = (page-1) * 10
  console.log(req.query);
  Books.getAllBooks(offset)
  .then(bookResults => {
    res.render('index', { books: bookResults, page:page})
  })
})

router.get('*', function(req, res, next) {
  res.redirect('/')
})

module.exports = router;
