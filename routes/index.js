const router = require('express').Router();
const userRouter = require('./users');
const cardsRouter = require('./cards');
const { loginValidator, createUserValidator } = require('../validators/celebrate-validators');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardsRouter);

router.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
