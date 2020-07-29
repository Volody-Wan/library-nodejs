const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:profileController');
require('dotenv').config();

function profileController(nav) {
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }
  function getProfile(req, res) {
    const url = process.env.DB_HOST;
    const dbName = process.env.DB_NAME;

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = db.collection('users');
        // eslint-disable-next-line no-underscore-dangle
        const user = await col.findOne({ _id: new ObjectID(req.user._id) });
        res.render('profile/profileView', {
          nav,
          title: 'Profile',
          user,
        });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  }

  function updateProfile(req, res) {
    const {
      email,
      firstname,
      lastname,
      twitter,
      linkedIn,
    } = req.body;
    const url = process.env.DB_HOST;
    const dbName = process.env.DB_NAME;

    (async function addUser() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = db.collection('users');
        const user = {
          email: email.toLowerCase(),
          firstname,
          lastname,
          twitter,
          linkedIn,
        };
        col.updateOne({
          // eslint-disable-next-line no-underscore-dangle
          _id: new ObjectID(req.user._id),
        }, {
          $set: {
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            twitter: user.twitter,
            linkedIn: user.linkedIn,
          },
        }, (err) => {
          if (err) {
            debug(err);
          } else {
            res.redirect('/profile');
          }
        });
      } catch (err) {
        debug(err.stack);
      }
    }());
  }

  return {
    middleware,
    getProfile,
    updateProfile,
  };
}

module.exports = profileController;
