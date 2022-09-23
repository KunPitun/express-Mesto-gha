const User = require('../models/user');
const { handleErrors } = require('../errors/handle-errors');
const NotFoundError = require('../errors/not-found-error');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, runValidators: true,
  })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, runValidators: true,
  })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleErrors(err, res);
    });
};
