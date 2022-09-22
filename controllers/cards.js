const Card = require('../models/card');

function formattingCardData(card) {
  const resCard = {
    name: card.name,
    link: card.link,
    owner: card.owner,
    likes: card.likes,
    _id: card._id,
    createdAt: card.createdAt,
  };
  return resCard;
}

function handleErrors(res, err, type) {
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
    return;
  }
  if (err.name === 'TypeError' && (type === 'likeCard' || type === 'dislikeCard')) {
    res.status(404).send({ message: 'Передан несуществующий _id карточки' });
    return;
  }
  if (err.name === 'CastError' && type === 'deleteCard') {
    res.status(400).send({ message: 'Передан некорректный _id карточки' });
    return;
  }
  if (err.name === 'TypeError' && type === 'deleteCard') {
    res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    return;
  }
  if (err.name === 'CastError' && type === 'likeCard') {
    res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
    return;
  }
  if (err.name === 'CastError' && type === 'dislikeCard') {
    res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
    return;
  }
  res.status(500).send({ message: 'Ошибка по умолчанию' });
}

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      const resCards = cards.map((card) => {
        const resCard = formattingCardData(card);
        return resCard;
      });
      res.status(200).send({ data: resCards });
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ data: formattingCardData(card) });
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.status(200).send({ data: formattingCardData(card) });
    })
    .catch((err) => {
      handleErrors(res, err, 'deleteCard');
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      res.status(200).send({ data: formattingCardData(card) });
    })
    .catch((err) => {
      handleErrors(res, err, 'likeCard');
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      res.status(200).send({ data: formattingCardData(card) });
    })
    .catch((err) => {
      handleErrors(res, err, 'dislikeCard');
    });
};