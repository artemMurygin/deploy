const usersRouter = require('./users/users.routes');
const authRouter = require('./auth/auth.routes');
const indexRouter = require('express').Router();
const tokensRouter = require('./tokens/tokens.routes');
const verifyAccessToken = require('../middleware/verifyAccessToken');

indexRouter.use('/users', verifyAccessToken, usersRouter);
indexRouter.use('/auth', authRouter);
indexRouter.use('/tokens', tokensRouter);

module.exports = indexRouter;
