const router = require('express').Router();
const {
  cardIdValidator, createCardValidator,
} = require('../validators/celebrate-validators');
const {
  getAllCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.delete('/:cardId', cardIdValidator, deleteCard);
router.post('/', createCardValidator, createCard);
router.put('/:cardId/likes', cardIdValidator, likeCard);
router.delete('/:cardId/likes', cardIdValidator, dislikeCard);

module.exports = router;
