const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getUsers, getUser, updateUser, updateAvatar, getUserbyId,
} = require('../controllers/users');
/*
router.get('/users', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(), // валидируем заголовки
}), getUsers);

router.get('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(), // валидируем заголовки
}), getUser);

router.get('/users/:userId', celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(), // валидируем заголовки
}), getUserbyId);

router.patch('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(), // валидируем заголовки
  body: Joi.object().keys({
    // валидируем body
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required(),
  }).unknown(), // валидируем заголовки
  body: Joi.object().keys({
    // валидируем body
    avatar: Joi.string().required().custom(method),
  }),
}), updateAvatar);*/

router.get('/users', getUsers);

router.get('/users/me', getUser);

router.get('/users/:userId', getUserbyId);

router.patch('/users/me', updateUser);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
