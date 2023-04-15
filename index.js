const express = require('express');
const fileUpload = require("express-fileupload");
const cors = require('cors');

const https = require('https')
const fs = require('fs')

const { config } = require('./config/config')
const path = require('path');
const routerApi = require('./routes');

const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler')

// const optionsHTTPS = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };

const app = express();
const port = config.port || 3000;

app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}))

const whitelist = ['http://localhost:5500', 'https://myapp.co'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  }
}
app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));

app.get('/', (req, res) => {
  res.send('Hello world');
});

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.use("/public", express.static(path.join(__dirname, 'public')));

// const appHTTPS = https.createServer(options, app);

app.listen(port, () => {
  console.log(`Mi port ${port}`);
});
