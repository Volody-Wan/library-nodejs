const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(nav) {
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  function getBooks(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'librarian';

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = db.collection('books');
        const books = await col.find(
          {}, { projection: { title: 1, author: 1, image: 1 } },
        ).sort({ title: 1 }).toArray();

        res.render('booksListView',
          {
            nav,
            title: 'Books',
            books,
          });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  function getBookById(req, res) {
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'librarian';

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = db.collection('books');
        const authorsbooksCol = db.collection('authorsbooks');

        const book = await col.findOne({ _id: new ObjectID(id) });
        const authorsbooks = await authorsbooksCol.findOne({ books: { $elemMatch: { id } } }) || {};

        res.render('bookView',
          {
            nav,
            title: 'Books',
            book,
            authorId: authorsbooks.authorId,
          });
      } catch (err) {
        debug(err.stack);
      }
    }());
  }

  return {
    getBooks,
    getBookById,
    middleware,
  };
}

module.exports = bookController;