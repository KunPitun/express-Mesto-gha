const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const InternalServerError = require('../errors/internal-server-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const handleErrors = require('../errors/handle-errors');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      next(new InternalServerError('Ошибка на стороне сервера'));
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с данным _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => handleErrors(err, next));
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь с данным _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => handleErrors(err, next));
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
        return;
      }
      if (err.name === 'ValidationError') {
        if (err.errors.name) {
          next(new BadRequestError(err.errors.name.message));
          return;
        }
        if (err.errors.about) {
          next(new BadRequestError(err.errors.about.message));
          return;
        }
        if (err.errors.avatar) {
          next(new BadRequestError(err.errors.avatar.message));
          return;
        }
        if (err.errors.password) {
          next(new BadRequestError(err.errors.password.message));
          return;
        }
        if (err.errors.email) {
          next(new BadRequestError(err.errors.email.message));
          return;
        }
        next(new InternalServerError('Ошибка на стороне сервера'));
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, runValidators: true,
  })
    .orFail(() => {
      throw new NotFoundError('Пользователь с данным _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (err.errors.name) {
          next(new BadRequestError(err.errors.name.message));
          return;
        }
        if (err.errors.about) {
          next(new BadRequestError(err.errors.about.message));
          return;
        }
      }
      handleErrors(err, next);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, runValidators: true,
  })
    .orFail(() => {
      throw new NotFoundError('Пользователь с данным _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (err.errors.avatar) {
          next(new BadRequestError(err.errors.avatar.message));
          return;
        }
      }
      handleErrors(err, next);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ message: 'Успешная авторизация' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (err.errors.password) {
          next(new BadRequestError(err.errors.password.message));
          return;
        }
        if (err.errors.email) {
          next(new BadRequestError(err.errors.email.message));
          return;
        }
      }
      if (err.name === 'UnauthorizedError') {
        next(err);
        return;
      }
      next(new InternalServerError('Ошибка на стороне сервера'));
    });
};
