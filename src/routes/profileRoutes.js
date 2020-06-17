const express = require('express');

const profileRouter = express.Router();

function router(nav) {
  profileRouter.route('/')
    .all((request, response, next) => {
      if (request.user) {
        next();
      } else {
        response.redirect('/');
      }
    })
    .get((request, response) => {
      response.render('profile', {
        nav,
        title: 'Profile',
        user: request.user,
      });
    });

  return profileRouter;
}

module.exports = router;
