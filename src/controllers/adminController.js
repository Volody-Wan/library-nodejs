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
  function getAdminPage(req, res) {
    const pageImages = {
      recommendation: 'https://pm1.narvii.com/6679/5354604904cb3ad8ee6966b9866b200618b796bc_hq.jpg',
      author: 'https://lh3.googleusercontent.com/proxy/sGfSEwhXtjbn0SCUCy85FXKHWyz5l8NQKGGcN9Ykh-5t04FuSGb_MvpFLre10u6-APt0LPLGrgfTgERkdMRDNlFvIJqmrI-HO_n-3JNcoF4VysK4lxQ',
      book: 'https://lh3.googleusercontent.com/proxy/bXjxr2kyf1HqjNa42T8xuxKEXFz1s260grhrXsyQVkKWbzcsv9wv4qD-DtOBPFYF1F9cUpfhqBMt8DCoBdoL2ulWjm-FhfIF5tnrfC9sfSB5XA',
    };
    res.render('admin/adminView',
      {
        nav,
        title: 'Admin Panel',
        pageImages,
      });
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

        res.render('admin/adminRecommendedBooks',
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
    let updatedBookList = [];

    if (req.body.bookId) {
      req.body.bookId.forEach(bookId => {
        updatedBookList.push({
          bookId
        });
      });
    }

    const url = 'mongodb://localhost:27017';
    const dbName = 'librarian';

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const recommendedBooksCol = db.collection('recommendedBooks');

        await recommendedBooksCol.deleteMany({});
        await recommendedBooksCol.insertMany(updatedBookList);

      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());

    res.redirect('/admin/recommendedBooks');
  }
  function getAddAuthor(req, res) {
    res.render('admin/adminAddAuthor',
      {
        nav,
        title: 'Admin Panel',
      });
  }

  return {
    middleware,
    getAdminPage,
    getRecommendedBooks,
    updateRecommendedBooks,
    getAddAuthor,
  };
}

module.exports = adminController;
