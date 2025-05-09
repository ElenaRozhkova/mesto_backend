// eslint-disable-next-line max-classes-per-file
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const User = require('../models/user.js');
const NotFoundError = require('../errors/not-found.js');
const UnauthorizedError = require('../errors/unauthorized-error.js');
const DublikateError = require('../errors/dublikate-error.js');
const ValidationError = require('../errors/validation-error.js');

const {
  STATUS_OK, STATUS_CREATE,
} = require('../../utils/error.js');

const { NODE_ENV, JWT_SECRET } = process.env;
/*
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      res.send({ token });
    })
    .catch(() => { throw new UnauthorizedError('Передан неверный логин или пароль.'); })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(STATUS_CREATE).send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new DublikateError('Пользователь с указанным email уже существует');
      }
    })
    .catch(next);
};
*/
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const userId = '6171352c4755cc75a0646a14';
  // const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch(next);
};

module.exports.getUserbyId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate('6171352c4755cc75a0646a14', { name, about }, { new: true, runValidators: true })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при обновлении профиля.');
      }
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    '6171352c4755cc75a0646a14', { avatar }, { new: true, runValidators: true },
  )
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара.');
      }
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch(next);
};
