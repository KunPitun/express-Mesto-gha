const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const InternalServerError = require('../errors/internal-server-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

const badRequestErrorMessage = 'Некорректный _id';
const notFoundErrorMessage = 'Карточка с данным _id не найдена';
const internalServerErrorMessage = 'Ошибка на стороне сервера';
const forbiddenErrorMessage = 'Недостаточно прав для выполнения данного действия';

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      next(new InternalServerError(internalServerErrorMessage));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
        return;
      }
      next(new InternalServerError(internalServerErrorMessage));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError(notFoundErrorMessage);
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((deletedCard) => res.send({ data: deletedCard }));
      } else {
        throw new ForbiddenError(forbiddenErrorMessage);
      }
    })
    .catch((err) => {
      if (err.name === 'ForbiddenError') {
        next(err);
        return;
      }
      if (err.name === 'NotFoundError') {
        next(err);
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError(badRequestErrorMessage));
        return;
      }
      next(new InternalServerError(internalServerErrorMessage));
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError(notFoundErrorMessage);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(err);
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError(badRequestErrorMessage));
        return;
      }
      next(new InternalServerError(internalServerErrorMessage));
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError(notFoundErrorMessage);
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(err);
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError(badRequestErrorMessage));
        return;
      }
      next(new InternalServerError(internalServerErrorMessage));
    });
};
