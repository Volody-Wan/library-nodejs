const express = require('express');

const profileController = require('../controllers/profileController');

const profileRouter = express.Router();

function router(nav) {
  const { middleware, getProfile } = profileController(nav);
  profileRouter.route('/')
    .all(middleware)
    .get(getProfile);

  return profileRouter;
}

module.exports = router;
