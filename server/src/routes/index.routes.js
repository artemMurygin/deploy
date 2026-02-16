const express = require('express');
const indexRouter = express.Router();

const usersRouter = require('./users/users.routes');
const booksRouter = require('./books/books.routes');
const authRouter = require('./auth/auth.routes');
const tokensRouter = require('./tokens/tokens.routes');
const genresRouter = require('./genres/genres.routes');
const tagsRouter = require('./tags/tags.routes');
const favoritesRouter = require('./favorites/favorites.routes');
const reviewsRouter = require('./reviews/reviews.routes');

const verifyAccessToken = require('../middleware/verifyAccessToken');

indexRouter.use('/auth', authRouter);
indexRouter.use('/tokens', tokensRouter);
indexRouter.use('/genres', genresRouter);
indexRouter.use('/tags', tagsRouter);

indexRouter.use('/books', verifyAccessToken, booksRouter);
indexRouter.use('/', verifyAccessToken, favoritesRouter);
indexRouter.use('/', verifyAccessToken, reviewsRouter);
indexRouter.use('/users', verifyAccessToken, usersRouter);

module.exports = indexRouter;