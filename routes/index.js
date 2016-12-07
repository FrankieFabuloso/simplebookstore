var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bookstore' });
});

/* GET bookDetails */
router.get('/book', function(req, res, next) {
  res.render('bookDetails', { book: {title: "Cheeseballs", description: "This book is about Cheeseballs", average_rating: 4, authors: ["Mr. Cheese", "Mrs.Cheese"] }});
});

module.exports = router;
