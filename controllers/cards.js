const Card = require('../models/card');
const { handleErrors } = require('../errors/handle-errors');
const NotFoundError = require('../errors/not-found-error');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};
