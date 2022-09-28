const router = require('express').Router();
const {
  idValidator, updateUserValidator, updateUserAvatarValidator,
} = require('../validators/celebrate-validators');
const {
  getAllUsers, getUser, getUserMe,
  updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getUserMe);
router.get('/:userId', idValidator, getUser);
router.patch('/me', updateUserValidator, updateUser);
router.patch('/me/avatar', updateUserAvatarValidator, updateUserAvatar);

module.exports = router;
