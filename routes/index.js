const express = require('express');

const auth = require('./user.routes');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/users', auth);
}

module.exports = routerApi;
