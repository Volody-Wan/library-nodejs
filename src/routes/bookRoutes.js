const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:booksRoutes');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.use((request, response, next) => {
    if (request.user) {
      next();
    } else {
      response.redirect('/');
    }
  });
  bookRouter.route('/').get((request, response) => {
    const url = 'mongodb://localhost:27017';
    const dbName = 'librarian';

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = await db.collection('books');
        const books = await col.find().toArray();

        response.render('booksListView',
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
  });

  bookRouter.route('/:id').get((request, response) => {
    const { id } = request.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'librarian';

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = await db.collection('books');
        const authorsbooksCol = await db.collection('authorsbooks');

        const book = await col.findOne({ _id: new ObjectID(id) });
        const authorsbooks = await authorsbooksCol.findOne({ books: { $elemMatch: { id } } }) || {};

        response.render('bookView',
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
  });

  return bookRouter;
}

module.exports = router;
