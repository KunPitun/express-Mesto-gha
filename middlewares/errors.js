const { isCelebrateError } = require('celebrate');

const BadRequestErrCode = 400;

module.exports = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    res.status(BadRequestErrCode).send({ message: 'Переданы некорректные данные' });
    return;
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
};
