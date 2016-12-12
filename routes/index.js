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
    res.render('index', { books: result, isBookList: true })
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
    res.render('bookDetails', { book: result, addBookFlag: false});
  })
})

router.get('/admin', function(req, res, next) {
  const page = req.query.page || 1
  const offset = (page-1) * 12
  Books.getAllBooks(offset)
  .then(bookResults => {
    res.render('index', { books: bookResults, page:page, isAdmin:true})
  })
})

router.get('/admin/book/:id', function(req, res, next) {
  const id = req.params.id
  Books.getBook(id)
  .catch(error => {
    console.log(error);
    res.redirect('/')
  })
  .then(result => {
    res.render('bookDetails', { book: result, addBookFlag: false, isAdmin:true});
  })
})

router.post('/admin/addBook', function(req, res, next) {
  const parameters = req.body
  Books.addBook(parameters)
  .catch( error => {
    console.log(error);
    res.redirect('/')
  })
  .then(result => {
    console.log("Result: ",result)
    res.redirect('/admin/addBook/success')
  })
})

router.post('/edit/:id', function(req, res, next) {
  const id = parseInt( req.params.id )
  console.log(id, req.body );

  // Books.getBook(id)
  Books.updateBook( id, req.body )
  .then( result => {
    console.log( result);
    res.redirect( `/book/${id}` )
  })
})
router.get('/admin/addBook/success', function(req, res, next) {
  Books.lastBook()
  .then(results => {
    res.render('bookDetails', {book: results})
  })
})

router.get('/delete/:id', function(req, res, next) {
  const id = req.params.id
  const page = req.query.page
  Books.deleteBook(id)
  res.redirect(`/admin/?page=${page}`)
})

router.get('*', function(req, res, next) {
  res.redirect('/')
})

module.exports = router;
