const {
  INVALIDUSER,
  INVALIDPASSWORD,
  PASSWORDSMISMATCH,
  USERNAMEEXISTS,
  EMAILUSED,
} = require('../constants/constants.js');

function loginController(nav) {
  function middleware(req, res, next) {
    if (req.user) {
      res.redirect('/books');
    } else {
      next();
    }
  }

  function getLogin(req, res) {
    const errors = req.flash('error');
    res.render('login',
      {
        nav,
        title: 'Alexandria Library',
        invalidUser: errors.find((error) => error === INVALIDUSER),
        invalidPassword: errors.find((error) => error === INVALIDPASSWORD),
        passwordsMissMatch: errors.find((error) => error === PASSWORDSMISMATCH),
        usernameInUse: errors.find((error) => error === USERNAMEEXISTS),
        emailInUse: errors.find((error) => error === EMAILUSED),
      });
  }

  return {
    middleware,
    getLogin,
  };
}

module.exports = loginController;
