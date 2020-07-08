const express = require('express');
const bookController = require('../controllers/bookController.js');
const adminController = require('../controllers/adminController');

const bookRouter = express.Router();

function router(nav) {
  const {
    getBooks,
    getBookById,
    middleware,
  } = bookController(nav);
  const {
    updateBookById,
  } = adminController();

  bookRouter.use(middleware);
  bookRouter.route('/').get(getBooks);
  bookRouter.route('/:id')
    .get(getBookById)
    .post(updateBookById);

  return bookRouter;
}

module.exports = router;
