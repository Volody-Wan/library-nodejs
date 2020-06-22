const express = require('express');
const bookController = require('../controllers/bookController.js');

const bookRouter = express.Router();

function router(nav) {
  const { getBooks, getBookById, middleware } = bookController(nav);
  bookRouter.use(middleware);
  bookRouter.route('/').get(getBooks);
  bookRouter.route('/:id').get(getBookById);

  return bookRouter;
}

module.exports = router;
