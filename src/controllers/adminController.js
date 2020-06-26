const debug = require('debug')('app:adminController');
const { MongoClient, ObjectID } = require('mongodb');

function adminController(nav) {
  function middleware(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.redirect('/');
    }
  }
  function getRecommendedBooks(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'librarian';

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const recommendedBooksCol = db.collection('recommendedBooks');

        const recommendedBooks = await recommendedBooksCol.find().toArray();

        res.render('adminView',
          {
            nav,
            title: 'Admin Panel',
            recommendedBooks,
          });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  return {
    middleware,
    getRecommendedBooks,
  };
}

module.exports = adminController;
