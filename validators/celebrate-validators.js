const { celebrate, Joi } = require('celebrate');
const urlValidator = require('./joi-url-validator');
const hexValidator = require('./hexadecimal-validator');

module.exports.userIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(24)
      .custom(hexValidator, 'hex validation'),
  }),
});

module.exports.cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24)
      .custom(hexValidator, 'hex validation'),
  }),
});

module.exports.updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.updateUserAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValidator, 'url validation'),
  }),
});

module.exports.createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(urlValidator, 'url validation'),
  }),
});

module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.createUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(urlValidator, 'url validation'),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
