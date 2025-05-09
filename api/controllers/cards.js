const Card = require('../models/card');
const NotFoundError = require('../api/errors/not-found.js');
const ValidationError = require('../api/errors/validation-error.js');
const ForbiddenError = require('../api/errors/forbidden-error.js');

const {
  STATUS_OK, STATUS_CREATE,
} = require('../utils/error.js');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  //const owner = req.user._id;
  const owner = '6171352c4755cc75a0646a14';
  Card.create({ name, link, owner })
    .then((card) => res.status(STATUS_CREATE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: '6171352c4755cc75a0646a14' } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для постановки лайка.');
      }
    })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Kарточкa по указанному _id не найденa!');
      }
      return res.status(STATUS_OK).send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: '6171352c4755cc75a0646a14' } }, // убрать _id из массива
    { new: true },
  )
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные для снятии лайка.');
      }
    })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Kарточкa по указанному _id не найденa!');
      }
      return res.status(STATUS_OK).send(card);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      }
    })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Kарточкa по указанному _id не найденa!');
      }
      if (card.owner.toString() === '6171352c4755cc75a0646a14') {
        Card.findByIdAndRemove(
          req.params.cardId,
        )
          .then(() => res.status(STATUS_OK).send(card))
          .catch(next);
      } else throw new ForbiddenError('Вы не можете удалять карточки других пользователей.');
    })
    .catch(next);
};
