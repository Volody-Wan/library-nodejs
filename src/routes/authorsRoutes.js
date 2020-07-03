const express = require('express');

const authorsController = require('../controllers/authorsController');

const authorRoutes = express.Router();

function router(nav) {
  const { middleware, getAuthors, getAuthorById, updateUserById } = authorsController(nav);
  authorRoutes.use(middleware);
  authorRoutes.route('/').get(getAuthors);
  authorRoutes.route('/:id').get(getAuthorById);
  authorRoutes.route('/:id').post(updateUserById);

  return authorRoutes;
}

module.exports = router;
