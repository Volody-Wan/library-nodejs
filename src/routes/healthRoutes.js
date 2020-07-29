const express = require('express');

const healthController = require('../controllers/healthController');

const healthRoutes = express.Router();

function router(nav) {
  const {
    healthCheck,
  } = healthController(nav);

  healthRoutes.route('/').get(healthCheck);

  return healthRoutes;
}

module.exports = router;
