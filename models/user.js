const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/unauthorized-error');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Имя пользователя должно быть не меньше 2-х символов'],
    maxlength: [30, 'Имя пользователя должно быть не более 30-ти символов'],
    default: 'Жак-Ив-Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Описание пользователя должно быть не меньше 2-х символов'],
    maxlength: [30, 'Описание пользователя должно быть не меньше 2-х символов'],
    default: 'Исследователь океана',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  password: {
    type: String,
    minlength: [8, 'Пароль должен содержать не менее 8-ми символов'],
    required: [true, 'Не указан пароль'],
    select: false,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Не указан email'],
    validate: [validator.isEmail, 'Некорректный email'],
  },
});

userSchema.path('avatar').validate(
  (value) => /https?:\/\/w?w?w?\.?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]#?/i.test(value),
  'Некорректная ссылка на аватар',
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
