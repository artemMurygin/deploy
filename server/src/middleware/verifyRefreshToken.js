const jwt = require('jsonwebtoken')

const verifyRefreshToken = (req, res, next) => {

  try {

    const { refreshToken } = req.cookies

    const { user } = jwt.verify(refreshToken, process.env.SECRET_REFRESH)

    res.locals.user = user

    next()

  } catch (error) {
    console.log('Не валидный refresh token')
    res.status(401).json({ message: 'Не валидный refresh token'})
  }

}

module.exports = verifyRefreshToken