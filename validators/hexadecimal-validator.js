module.exports = (value, helpers) => {
  const regex = /[0-9a-f]{24}/i;
  if (!regex.test(value)) {
    return helpers.message('Строка не соответствует шестнадцатиричной');
  }
  return value;
};
