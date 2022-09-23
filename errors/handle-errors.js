const errorCodeBadRequest = 400;
const errorCodeNotFound = 404;
const errorCodeInternalServer = 500;

module.exports.handleErrors = (err, res) => {
  if (err.name === 'ValidationError') {
    res.status(errorCodeBadRequest).send({ message: 'Переданы некорректные данные' });
    return;
  }
  if (err.name === 'CastError') {
    res.status(errorCodeBadRequest).send({ message: 'Передан некорректный _id' });
    return;
  }
  if (err.name === 'NotFoundError') {
    res.status(errorCodeNotFound).send({ message: 'Данные по запросу не найдены' });
    return;
  }
  res.status(errorCodeInternalServer).send({ message: 'Ошибка по умолчанию' });
};
