const express = require('express');

const {
  INVALIDUSER,
  INVALIDPASSWORD,
  PASSWORDSMISMATCH,
  USERNAMEEXISTS,
  EMAILUSED,
} = require('../constants/constants.js');

const loginRouter = express.Router();

function router(nav) {
  loginRouter.route('/')
    .all((request, response, next) => {
      if (request.user) {
        response.redirect('/books');
      } else {
        next();
      }
    })
    .get((request, response) => {
      const errors = request.flash('error');
      response.render('login',
        {
          nav,
          title: 'Alexandria Library',
          invalidUser: errors.find((error) => error === INVALIDUSER),
          invalidPassword: errors.find((error) => error === INVALIDPASSWORD),
          passwordsMissMatch: errors.find((error) => error === PASSWORDSMISMATCH),
          usernameInUse: errors.find((error) => error === USERNAMEEXISTS),
          emailInUse: errors.find((error) => error === EMAILUSED),
        });
    });
  return loginRouter;
}

module.exports = router;
