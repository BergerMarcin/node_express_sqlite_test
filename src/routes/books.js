const express = require('express');
const router = express.Router();
const {getAllRows} = require('../db/db_controller')


/**
 * Get and show all books
 */
router.get('/', async function (req, res) {
  console.log(`ROUTER books controller START *************** get all books, path '/books'`)
  await getAllRows('books')
    .then((books) => {
      console.log(books);
      res.render('books', {title: 'Books', books: books})
      console.log(`ROUTER controller END ***************`)
    })
    .catch((err) => {
        res.render('books', {title: 'Books', books: null, err})
        console.log(`ROUTER controller END ***************`)
      }
    )
});

module.exports = router;
