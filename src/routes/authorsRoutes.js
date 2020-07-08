const express = require('express');

const authorsController = require('../controllers/authorsController');
const adminController = require('../controllers/adminController');

const authorRoutes = express.Router();

function router(nav) {
  const {
    middleware,
    getAuthors,
    getAuthorById,
  } = authorsController(nav);
  const {
    updateAuthorById,
  } = adminController();

  authorRoutes.use(middleware);
  authorRoutes.route('/').get(getAuthors);
  authorRoutes.route('/:id')
    .get(getAuthorById)
    .post(updateAuthorById);

  return authorRoutes;
}

module.exports = router;
