const Card = require('../models/card');
const { handleErrors } = require('../errors/handle-errors');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => handleErrors(err, next));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => handleErrors(err, next));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с данным _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((deletedCard) => res.send({ data: deletedCard }));
      } else {
        throw new ForbiddenError('Недостаточно прав для выполнения данного действия');
      }
    })
    .catch((err) => handleErrors(err, next));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка с данным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => handleErrors(err, next));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Карточка с данным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => handleErrors(err, next));
};
