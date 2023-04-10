const express = require('express');
const cors = require('cors');
const { config } = require('./config/config')
const path = require('path');
const routerApi = require('./routes');

const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler')

const app = express();
const port = config.port || 3000;

app.use(express.json());

const whitelist = ['http://localhost:8080', 'https://myapp.co'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  }
}
app.use(cors(options));

app.get('/', (req, res) => {
  res.send('Hello world');
});

// routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.use("/public", express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Mi port ${port}`);
});
