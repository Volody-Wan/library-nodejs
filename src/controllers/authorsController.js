const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:authorsController');
const dateformat = require('dateformat');

function authorsController(nav) {
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }

  function getAuthors(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'librarian';

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = db.collection('authors');
        const authors = await col.find({}).project({ name: 1 }).sort({ name: 1 }).toArray();

        res.render('authors',
          {
            nav,
            title: 'Authors',
            authors,
          });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  function getAuthorById(req, res) {
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'librarian';

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = db.collection('authors');
        const authorsbooks = db.collection('authorsbooks');
        const authors = await col.find({}, { projection: { name: 1 } }).sort({ name: 1 }).toArray();
        const author = await col.findOne({ _id: new ObjectID(id) });
        author.birth = dateformat(author.birth, 'dS mmmm, yyyy', true);
        if (author.death) {
          author.death = dateformat(author.death, 'dS mmmm, yyyy', true);
        }
        const { books } = await authorsbooks
          .findOne({ authorId: id }, { projection: { books: true, _id: false } }) || {};

        res.render('author',
          {
            nav,
            title: 'Authors',
            authors,
            author,
            books,
          });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  return {
    middleware,
    getAuthors,
    getAuthorById,
  };
}

module.exports = authorsController;
