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

        res.render('authorsView',
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
              authorId: id
            }
          },
          {
            '$unwind': '$booksIds'
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
                    }
                  }
                },
                {
                  $project:
                  {
                    image: true,
                    _id: false
                  }
                }
              ],
              as: 'books'
            }
          },
          {
            $unwind: '$books'
          },
          {
            $group: {
              _id: '$_id',
              books: {
                $push: {
                  id: '$booksIds',
                  image: '$books.image'
                }
              }
            }
          },
          {
            $project:
            {
              books: true,
              _id: false
            }
          }
        ]).toArray();

        if (authorBooksResult && authorBooksResult[0]) {
          books = authorBooksResult[0].books;
        }

        res.render('authorView',
          {
            nav,
            title: 'Authors',
            authors,
            author,
            books,
            userRole: req.user.role
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
        error: "Operation not allowed"
      });
    }

    const { id } = req.params;

    let updateAuthor = {
      name: req.body.updateAuthorName,
      birth: req.body.updateAuthorBirthDay,
      death: req.body.updateAuthorDeathDay,
      language: req.body.updateAuthorLanguage,
      biography: req.body.updateAuthorBiography,
      image: req.body.updatedAuthorImage,
      references: req.body.updateReferenceList,
      genre: req.body.updateAuthorGenres,
      nationality: req.body.updateAuthorNationality,
    }

    let error = {};
    let isAuthorInvalid = validateAuthorIntegrity(updateAuthor, error);
    let isAuthorBooksInvalid = valdiateAuthorBooksIntegrity(req.body.updateAuthorBooks, error);

    if (isAuthorInvalid || isAuthorBooksInvalid) {
      res.json(error);
    } else {
      let authorBooks;
      if (typeof req.body.updateAuthorBooks === "string") {
        authorBooks = Object.values([req.body.updateAuthorBooks]);
      } else if (Array.isArray(req.body.updateAuthorBooks)) {
        authorBooks = req.body.updateAuthorBooks.filter(item => item);
      }

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
            }
          });

          await authorsBooksCollection.updateOne({
            authorId: id
          },
            {
              $set: {
                booksIds: authorBooks
              }
            },
            {
              upsert: true
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
    updateUserById
  };
}

function validateAuthorIntegrity(author, error) {
  let hasError = false;

  if (!author.name) {
    error.name = 'Name must be provided';
    hasError = true;
  }
  if (!author.birth) {
    error.birth = 'Birthday must be provided';
    hasError = true;
  } else {
    hasError = validateDate(author.birth, error, error.birth, hasError);
  }
  if (author.death) {
    hasError = validateDate(author.death, error, error.death, hasError);
  }
  if (!author.language) {
    error.language = 'Language must be provided';
    hasError = true;
  }
  if (!author.biography) {
    error.biography = 'Biography must be provided';
    hasError = true;
  }
  if (!author.image) {
    error.image = 'Image must be provided';
    hasError = true;
  }
  if (!author.genre) {
    error.genre = 'Genre must be provided';
    hasError = true;
  }
  if (!author.nationality) {
    error.nationality = 'Nationality must be provided';
    hasError = true;
  }
  if (author.references) {
    if (typeof author.references === "string") {
      author.references = Object.values([author.references]);
    } else if (Array.isArray(author.references)) {
      author.references = author.references.filter(item => item);
    } else {
      error.references = 'Reference must be either as a String or Array of Strings';
      hasError = true;
    }
  }

  if (hasError) {
    return true;
  } else {
    return false;
  }
}

function valdiateAuthorBooksIntegrity(authorbooks, error) {
  let hasError = false;
  if (authorbooks) {
    if (typeof authorbooks === "string" || Array.isArray(authorbooks)) {
      return false;
    }
    else {
      error.authorbooks = 'Books must be provided either as a String or Array of Strings';
      hasError = true;
    }
  }

  if (hasError) {
    return true;
  } else {
    return false;
  }
}

function validateDate(date, error, errorField, hasError) {
  if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    try {
      new Date(date).toISOString();
    } catch (err) {
      error.errorField = 'Invalid Date';
      hasError = true;
    }
  } else {
    error.errorField = 'Invalid format, must be yyyy-mm-dd';
    hasError = true;
  }
  return hasError;
}

function convertAuthorBooks(authorbooks) {
  if (typeof authorbooks === "string") {
    return Object.values([authorbooks]);
  } else if (Array.isArray(req.body.updateAuthorBooks)) {
    return req.body.updateAuthorBooks.filter(item => item);
  }
}

module.exports = authorsController;
