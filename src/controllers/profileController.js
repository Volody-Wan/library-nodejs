function profileController(nav) {
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }
  function getProfile(req, res) {
    res.render('profile', {
      nav,
      title: 'Profile',
      user: req.user,
    });
  }

  return {
    middleware,
    getProfile,
  };
}

module.exports = profileController;
