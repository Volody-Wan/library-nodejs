const express = require('express');

const adminController = require('../controllers/adminController');

const adminRoutes = express.Router();

function router(nav) {
  const { middleware, getRecommendedBooks, updateRecommendedBooks } = adminController(nav);
  adminRoutes.use(middleware);
  adminRoutes.route('/')
    .get(getRecommendedBooks);
    adminRoutes.route('/')
      .post(updateRecommendedBooks);

  return adminRoutes;
}

module.exports = router;
