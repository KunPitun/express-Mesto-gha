const router = require('express').Router();
const {
  idValidator, createCardValidator,
} = require('../validators/celebrate-validators');
const {
  getAllCards, deleteCard, createCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.delete('/:cardId', idValidator, deleteCard);
router.post('/', createCardValidator, createCard);
router.put('/:cardId/likes', idValidator, likeCard);
router.delete('/:cardId/likes', idValidator, dislikeCard);

module.exports = router;
