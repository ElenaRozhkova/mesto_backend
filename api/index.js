const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routeUser = require('./routes/users');
const routeCard = require('./routes/cards');
const NotFoundError = require('./errors/not-found.js');
const centralerrors = require('./middlewares/central-errors.js');
const { errors } = require('celebrate');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB подключено!'))
  .catch((err) => console.error('Ошибка подключения MongoDB:', err));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(routeUser);
app.use(routeCard);
app.use(errorLogger);
app.use(errors());
app.use(centralerrors);

app.get('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

// Экспортируем сервер как серверлес-функцию для Vercel
//module.exports = serverless(app);
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});