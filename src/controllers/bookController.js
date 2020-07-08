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
    const { page } = req.query;

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = db.collection('books');
        const recommendedBooksCol = db.collection('recommendedBooks');
        let recommendedBooksResult;
        if (!page || page === '1') {
          recommendedBooksResult = await recommendedBooksCol.aggregate([
            {
              $lookup:
              {
                from: 'books',
                let: { bookId: { $toObjectId: '$bookId' } },
                pipeline: [
                  {
                    $match:
                    {
                      $expr:
                      {
                        $eq: ['$_id', '$$bookId'],
                      },
                    },
                  },
                  { $project: { image: true, _id: false } },
                ],
                as: 'book',
              },
            },
            {
              $unwind: '$book',
            }]).toArray();
        }

        if (page) {
          const resultsPerPage = 8;
          const books = await col.find(
            {}, { projection: { title: 1, author: 1, image: 1 } },
          ).skip((resultsPerPage * page) - resultsPerPage)
            .limit(resultsPerPage).sort({ title: 1 })
            .toArray();

          if (page === '1') {
            res.render('books/booksListView',
              {
                nav,
                title: 'Books',
                books,
                recommendedBooks: recommendedBooksResult,
              });
          } else {
            res.json(books);
          }
        } else {
          const books = await col.find(
            {}, { projection: { title: 1, author: 1, image: 1 } },
          ).sort({ title: 1 }).toArray();

          res.render('books/booksListView',
            {
              nav,
              title: 'Books',
              books,
              recommendedBooks: recommendedBooksResult,
            });
        }
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
        const { authorId } = await authorsbooksCol.findOne({ booksIds: { $in: [id] } }) || {};

        res.render('books/bookView',
          {
            nav,
            title: 'Books',
            book,
            authorId,
            userRole: req.user.role,
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
