const express = require('express');
const searchontroller = require('../controllers/searchController.js');

const searchRouter = express.Router();

function router() {
  const { middleware, searchAuthors, searchBooks } = searchontroller();
  searchRouter.all(middleware);
  searchRouter.route('/authors').get(searchAuthors);
  searchRouter.route('/books').get(searchBooks);

  return searchRouter;
}

module.exports = router;
