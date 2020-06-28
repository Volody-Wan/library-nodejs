const debug = require('debug')('app:adminController');
const { MongoClient, ObjectID } = require('mongodb');
const e = require('express');

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

        const recommendedBooks = await recommendedBooksCol.aggregate([
          {
            $lookup:
            {
              from: "books",
              let: { bookId: { $toObjectId: "$bookId" } },
              pipeline: [
                {
                  $match:
                  {
                    $expr:
                    {
                      $eq: ["$_id", "$$bookId"],
                    }
                  }
                },
                {
                  $project:
                  {
                    title: true,
                    author: true,
                    image: true,
                    _id: false
                  }
                }
              ],
              as: "book"
            },
          },
          {
            $unwind: '$book'
          },
        ]).toArray();

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
  function updateRecommendedBooks(req, res) {
    if (req.body.bookId) {
      let updatedBookList = [];
      req.body.bookId.forEach(bookId => {
        updatedBookList.push({
          bookId
        });
      });

      const url = 'mongodb://localhost:27017';
      const dbName = 'librarian';

      (async function mongo() {
        let client;

        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });

          const db = client.db(dbName);
          const recommendedBooksCol = db.collection('recommendedBooks');

          await recommendedBooksCol.deleteMany({});
          const recommendedBooks = await recommendedBooksCol.insertMany(updatedBookList);

        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    }

    res.redirect('/admin');
  }

  return {
    middleware,
    getRecommendedBooks,
    updateRecommendedBooks,
  };
}

module.exports = adminController;
