const User = require('../models/user');

function formattingUserData(user) {
  const resUser = {
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    _id: user._id,
  };
  return resUser;
}

function handleErrors(res, err, type) {
  if (err.name === 'ValidationError' && type === 'createUser') {
    res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    return;
  }
  if (err.name === 'ValidationError' && type === 'updateUser') {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    return;
  }
  if (err.name === 'TypeError' && type === 'getUser') {
    res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    return;
  }
  if (err.name === 'CastError' && type === 'getUser') {
    res.status(400).send({ message: 'Передан некорректный _id пользователя' });
    return;
  }
  if (err.name === 'TypeError' && (type === 'updateUser' || type === 'updateUserAvatar')) {
    res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    return;
  }
  if (err.name === 'ValidationError' && type === 'updateUserAvatar') {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    return;
  }
  if (err.name === 'ValidationError' && type === 'updateUser') {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    return;
  }
  res.status(500).send({ message: 'Ошибка по умолчанию' });
}

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      const resUsers = users.map((user) => {
        const resUser = formattingUserData(user);
        return resUser;
      });
      res.status(200).send({ data: resUsers });
    })
    .catch((err) => {
      handleErrors(res, err);
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.status(200).send({ data: formattingUserData(user) });
    })
    .catch((err) => {
      handleErrors(res, err, 'getUser');
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({ data: formattingUserData(user) });
    })
    .catch((err) => {
      handleErrors(res, err, 'createUser');
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, runValidators: true,
  })
    .then((user) => {
      res.status(200).send({ data: formattingUserData(user) });
    })
    .catch((err) => {
      handleErrors(res, err, 'updateUser');
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, runValidators: true,
  })
    .then((user) => {
      res.status(200).send({ data: formattingUserData(user) });
    })
    .catch((err) => {
      handleErrors(res, err, 'updateUserAvatar');
    });
};