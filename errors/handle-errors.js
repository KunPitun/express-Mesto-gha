const InternalServerError = require('./internal-server-error');
const BadRequestError = require('./bad-request-error');
const ConflictError = require('./conflict-error');

module.exports.handleErrors = (err, next) => {
  if (err.code === 11000) {
    next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
    return;
  }
  if (err.name === 'CastError') {
    next(new BadRequestError('Некорректный _id'));
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
    if (err.errors.link) {
      next(new BadRequestError(err.errors.link.message));
      return;
    }
  }
  if (err.name === 'NotFoundError' || err.name === 'UnauthorizedError'
    || err.name === 'ForbiddenError') {
    next(err);
    return;
  }
  next(new InternalServerError('Ошибка на стороне сервера'));
};
