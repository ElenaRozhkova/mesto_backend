require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routeUser = require('./routes/users');
const routeCard = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/not-found.js');
const centralerrors = require('./middlewares/central-errors.js');
//const auth = require('./middlewares/auth');

const { PORT = 3002 } = process.env;

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {

});

/*mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(requestLogger); // подключаем логгер запросов*/
console.log("hallo");
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
/*
app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
}), createUser);

app.use(auth, routeUser);*/

//app.use(auth, routeCard);

app.use(routeUser);

app.use(routeCard);

app.use(errorLogger); // подключаем логгер ошибок
app.get('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не существует');
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use(centralerrors);
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
