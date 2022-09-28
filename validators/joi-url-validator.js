const { isURL } = require('validator');

module.exports = (value, helpers) => {
  if (!isURL(value)) {
    return helpers.message('Некорректный url');
  }
  return value;
};
