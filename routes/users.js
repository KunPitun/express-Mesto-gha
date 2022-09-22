const router = require('express').Router();
const { getAllUsers, getUser, createUser,
  updateUser, updateUserAvatar } = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;