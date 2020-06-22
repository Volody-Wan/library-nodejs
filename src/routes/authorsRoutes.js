const express = require('express');

const authorsController = require('../controllers/authorsController');

const authorRoutes = express.Router();

function router(nav) {
  const { middleware, getAuthors, getAuthorById } = authorsController(nav);
  authorRoutes.use(middleware);
  authorRoutes.route('/').get(getAuthors);
  authorRoutes.route('/:id').get(getAuthorById);

  return authorRoutes;
}

module.exports = router;
