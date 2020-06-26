const express = require('express');

const adminController = require('../controllers/adminController');

const adminRoutes = express.Router();

function router(nav) {
  const { middleware, getRecommendedBooks } = adminController(nav);
  adminRoutes.use(middleware);
  adminRoutes.route('/')
    .get(getRecommendedBooks);

  return adminRoutes;
}

module.exports = router;
