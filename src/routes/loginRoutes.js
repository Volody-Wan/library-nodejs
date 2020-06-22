const express = require('express');

const loginController = require('../controllers/loginController');

const loginRouter = express.Router();

function router(nav) {
  const { middleware, getLogin } = loginController(nav);
  loginRouter.route('/')
    .all(middleware)
    .get(getLogin);
  return loginRouter;
}

module.exports = router;
