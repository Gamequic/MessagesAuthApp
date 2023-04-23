const express = require('express');
const cors = require('cors');

const auth = require('./user.routes');
const msg = require('./messages.routes')

function routerApi(app, corsOptions) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use(cors(corsOptions))

  router.use('/users', auth);
  router.use('/messages', msg)
}

module.exports = routerApi;
