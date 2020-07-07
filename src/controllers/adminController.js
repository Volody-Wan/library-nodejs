/* eslint-disable no-underscore-dangle */
const debug = require('debug')('app:adminController');
const { MongoClient } = require('mongodb');
const commonService = require('../services/commonService')();
const authorService = require('../services/authorService')();
const bookService = require('../services/bookService')();

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
      author: 'https://images.unsplash.com/photo-1535546204504-586398ee6677?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
      book: 'https://thumbs.dreamstime.com/b/old-book-candle-11894952.jpg',
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
                {
                  $project:
                  {
                    title: true,
                    author: true,
                    image: true,
                    _id: false,
                  },
                },
              ],
              as: 'book',
            },
          },
          {
            $unwind: '$book',
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
    const updatedBookList = [];

    if (req.body.bookId) {
      req.body.bookId.forEach((bookId) => {
        updatedBookList.push({
          bookId,
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
  function addAuthor(req, res) {
    const createAuthor = {
      name: req.body.authorFullName,
      birth: req.body.authorBirthday,
      death: req.body.authorDeathday,
      language: req.body.authorLanguage,
      biography: req.body.authorBiography,
      image: req.body.authorImage,
      references: req.body.editReferenceList,
      genre: req.body.authorGenres,
      nationality: req.body.authorNationality,
    };

    const error = {};
    const isAuthorInvalid = authorService.validateAuthorIntegrity(createAuthor, error);
    const isAuthorBooksInvalid = authorService
      .valdiateAuthorBooksIntegrity(req.body.editAuthorBooks, error);

    if (isAuthorInvalid || isAuthorBooksInvalid) {
      res.json(error);
    } else {
      const url = 'mongodb://localhost:27017';
      const dbName = 'librarian';

      (async function mongo() {
        let client;

        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });

          const db = client.db(dbName);
          const authorsCollection = db.collection('authors');
          const authorsBooksCollection = db.collection('authorsbooks');

          const { insertedId } = await authorsCollection.insertOne(createAuthor);

          if (req.body.editAuthorBooks) {
            const authorBooks = commonService.convertAuthorBooks(req.body.editAuthorBooks);

            const insertAuthor = {
              authorId: insertedId.toString(),
              booksIds: authorBooks,
            };

            await authorsBooksCollection.insertOne(insertAuthor);
          }

          res.redirect(`/authors/${insertedId}`);
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    }
  }
  function getAddBook(req, res) {
    res.render('admin/adminAddBook',
      {
        nav,
        title: 'Admin Panel',
      });
  }
  function addBook(req, res) {
    const createBook = {
      title: req.body.bookTitle,
      author: req.body.bookAuthor,
      genre: req.body.bookGenre,
      image: req.body.bookImage,
      description: req.body.bookDescription,
      language: req.body.bookLanguage,
      published: req.body.bookPublication,
      references: req.body.editReferenceList,
    };

    const error = {};
    const isBookInvalid = bookService.validateBookIntegrity(createBook, error);

    if (isBookInvalid) {
      res.json(error);
    } else {
      const url = 'mongodb://localhost:27017';
      const dbName = 'librarian';

      (async function mongo() {
        let client;

        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });
          const db = client.db(dbName);

          if (!req.body.bookAuthorId) {
            const authorsCollection = db.collection('authors');

            const author = await authorsCollection.findOne(
              {
                name: createBook.author,
              },
              {
                projection: {
                  _id: 1,
                },
              },
            ) || {};

            req.body.bookAuthorId = author._id;
          }

          const booksCollection = db.collection('books');
          const { insertedId } = await booksCollection.insertOne(createBook);

          if (req.body.bookAuthorId) {
            const authorsBooksCollection = db.collection('authorsbooks');
            let authorBooks = await authorsBooksCollection.findOne(
              {
                authorId: req.body.bookAuthorId,
              },
            );

            if (authorBooks) {
              authorBooks.booksIds.push(insertedId.toString());

              await authorsBooksCollection.updateOne(
                {
                  _id: authorBooks._id,
                },
                {
                  $set: {
                    booksIds: authorBooks.booksIds,
                  },
                },
              );
            } else {
              authorBooks = {
                authorId: req.body.bookAuthorId.toString(),
                booksIds: [`${insertedId.toString()}`],
              };

              await authorsBooksCollection.insertOne(authorBooks);
            }
          }

          res.redirect(`/books/${insertedId}`);
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    }
  }

  return {
    middleware,
    getAdminPage,
    getRecommendedBooks,
    updateRecommendedBooks,
    getAddAuthor,
    addAuthor,
    getAddBook,
    addBook,
  };
}

module.exports = adminController;
