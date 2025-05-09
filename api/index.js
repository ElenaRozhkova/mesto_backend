const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const routeUser = require('../routes/users');
const routeCard = require('../routes/cards');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found.js');
const centralerrors = require('../middlewares/central-errors.js');
const { errors } = require('celebrate');
require('dotenv').config();

const serverless = require('serverless-http');

// Создаем экземпляр приложения Express
const app = express();
const { PORT = 3002 } = process.env;

// Подключаемся к MongoDB
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
module.exports.handler = serverless(app);
