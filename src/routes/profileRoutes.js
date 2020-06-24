const express = require('express');

const profileController = require('../controllers/profileController');

const profileRouter = express.Router();

function router(nav) {
  const { middleware, getProfile, updateProfile } = profileController(nav);
  profileRouter.route('/')
    .all(middleware)
    .get(getProfile);
  profileRouter.route('/updateProfile')
    .post(updateProfile);

  return profileRouter;
}

module.exports = router;
