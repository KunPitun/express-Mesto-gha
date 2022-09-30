const InternalServerError = require('./internal-server-error');
const BadRequestError = require('./bad-request-error');

module.exports.handleErrors = (err, next) => {
  if (err.name === 'NotFoundError') {
    next(err);
    return;
  }
  if (err.name === 'CastError') {
    next(new BadRequestError('Некорректный _id'));
    return;
  }
  next(new InternalServerError('Ошибка на стороне сервера'));
};
