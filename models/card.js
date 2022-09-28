const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Название карточки должно быть не меньше 2-х символов'],
    maxlength: [30, 'Название карточки должно быть не меньше 2-х символов'],
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: [validator.isURL, 'Некорректная ссылка на картинку'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
