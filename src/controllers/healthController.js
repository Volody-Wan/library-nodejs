const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:adminController');
require('dotenv').config();

function healthController() {
  function healthCheck(req, res) {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
    };
    try {
      res.send();
    } catch (e) {
      healthcheck.message = e;
      res.status(503).send();
    }
  }

  return {
    healthCheck,
  };
}

module.exports = healthController;
