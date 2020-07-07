const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:authorsController');
const dateformat = require('dateformat');
const authorService = require('../services/authorService')();

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

        res.render('authors/authorsView',
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
      let books;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = db.collection('authors');
        const authorsbooks = db.collection('authorsbooks');
        const authors = await col.find({}, { projection: { name: 1 } }).sort({ name: 1 }).toArray();
        const author = await col.findOne({ _id: new ObjectID(id) });
        author.formattedBirth = dateformat(author.birth, 'dS mmmm, yyyy', true);
        if (author.death) {
          author.formattedDeath = dateformat(author.death, 'dS mmmm, yyyy', true);
        }
        const authorBooksResult = await authorsbooks.aggregate([
          {
            $match:
            {
              authorId: id,
            },
          },
          {
            $unwind: '$booksIds',
          },
          {
            $lookup:
            {
              from: 'books',
              let: { bookIds: { $toObjectId: '$booksIds' } },
              pipeline: [
                {
                  $match:
                  {
                    $expr:
                    {
                      $eq: ['$_id', '$$bookIds'],
                    },
                  },
                },
                {
                  $project:
                  {
                    image: true,
                    _id: false,
                  },
                },
              ],
              as: 'books',
            },
          },
          {
            $unwind: '$books',
          },
          {
            $group: {
              _id: '$_id',
              books: {
                $push: {
                  id: '$booksIds',
                  image: '$books.image',
                },
              },
            },
          },
          {
            $project:
            {
              books: true,
              _id: false,
            },
          },
        ]).toArray();

        if (authorBooksResult && authorBooksResult[0]) {
          books = authorBooksResult[0].books;
        }

        res.render('authors/authorView',
          {
            nav,
            title: 'Authors',
            authors,
            author,
            books,
            userRole: req.user.role,
          });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  function updateUserById(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.json({
        error: 'Operation not allowed',
      });
    }

    const { id } = req.params;

    const updateAuthor = {
      name: req.body.updateAuthorName,
      birth: req.body.updateAuthorBirthDay,
      death: req.body.updateAuthorDeathDay,
      language: req.body.updateAuthorLanguage,
      biography: req.body.updateAuthorBiography,
      image: req.body.updatedAuthorImage,
      references: req.body.editReferenceList,
      genre: req.body.updateAuthorGenres,
      nationality: req.body.updateAuthorNationality,
    };

    const error = {};
    const isAuthorInvalid = authorService.validateAuthorIntegrity(updateAuthor, error);
    const isAuthorBooksInvalid = authorService
      .valdiateAuthorBooksIntegrity(req.body.editAuthorBooks, error);

    if (isAuthorInvalid || isAuthorBooksInvalid) {
      res.json(error);
    } else {
      const authorBooks = authorService.convertAuthorBooks(req.body.editAuthorBooks);

      const url = 'mongodb://localhost:27017';
      const dbName = 'librarian';

      (async function mongo() {
        let client;

        try {
          client = await MongoClient.connect(url, { useUnifiedTopology: true });

          const db = client.db(dbName);
          const authorsCollection = db.collection('authors');
          const authorsBooksCollection = db.collection('authorsbooks');

          await authorsCollection.updateOne({ _id: new ObjectID(id) }, {
            $set: {
              name: updateAuthor.name,
              birth: updateAuthor.birth,
              death: updateAuthor.death,
              language: updateAuthor.language,
              biography: updateAuthor.biography,
              image: updateAuthor.image,
              references: updateAuthor.references,
              genre: updateAuthor.genre,
              nationality: updateAuthor.nationality,
            },
          });

          await authorsBooksCollection.updateOne({
            authorId: id,
          },
          {
            $set: {
              booksIds: authorBooks,
            },
          },
          {
            upsert: true,
          });
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    }
    res.redirect(`/authors/${id}`);
  }

  return {
    middleware,
    getAuthors,
    getAuthorById,
    updateUserById,
  };
}

module.exports = authorsController;
