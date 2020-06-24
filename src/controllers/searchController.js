const { MongoClient } = require('mongodb');
const debug = require('debug')('app:searchController');

function searchController() {
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  function searchAuthors(req, res) {
    const { query } = req.query;
    if (query.length >= 3) {
      const url = 'mongodb://localhost:27017';
      const dbName = 'librarian';

      (async function mongo() {
        let client;

        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });

          const db = client.db(dbName);
          const col = db.collection('authors');
          const searchResult = await col.find(
            { name: { $regex: new RegExp(query, 'i') } }, { projection: { name: 1 } },
          ).sort({ name: 1 }).toArray();

          res.json(searchResult);
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    } else {
      res.json();
    }
  }

  function searchBooks(req, res) {
    const { query } = req.query;
    if (query.length >= 3) {
      const url = 'mongodb://localhost:27017';
      const dbName = 'librarian';

      (async function mongo() {
        let client;

        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });

          const db = client.db(dbName);
          const col = db.collection('books');
          const searchResult = await col.find(
            { title: { $regex: new RegExp(query, 'i') } }, { projection: { title: 1 } },
          ).sort({ title: 1 }).toArray();

          res.json(searchResult);
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    } else {
      res.json();
    }
  }
  return {
    middleware,
    searchAuthors,
    searchBooks,
  };
}

module.exports = searchController;
