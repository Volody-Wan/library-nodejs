const express = require('express');

const adminController = require('../controllers/adminController');

const adminRoutes = express.Router();

function router(nav) {
  const {
    middleware,
    getAdminPage,
    getRecommendedBooks,
    updateRecommendedBooks,
    getAddAuthor,
  } = adminController(nav);
  adminRoutes.use(middleware);
  adminRoutes.route('/').get(getAdminPage);
  adminRoutes.route('/recommendedBooks')
    .get(getRecommendedBooks)
    .post(updateRecommendedBooks);
  adminRoutes.route('/addAuthor')
    .get(getAddAuthor);

  return adminRoutes;
}

module.exports = router;
