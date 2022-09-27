require('dotenv').config();
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrateErrors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');
const NotFoundError = require('./errors/not-found-error');
const { loginOrCreateUserValidator } = require('./validators/celebrate-validators');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

app.use(celebrateErrors());

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', loginOrCreateUserValidator, login);
app.post('/signup', loginOrCreateUserValidator, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errors);

app.listen(PORT);
