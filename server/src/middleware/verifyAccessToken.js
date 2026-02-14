const jwt = require('jsonwebtoken')

const verifyAccessToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  try {
    const { user } = jwt.verify(token, process.env.SECRET_ACCESS)
    res.locals.user = user
    next()
  } catch (error) {
    console.log('Ошибка валидации токена', error)
    res.status(403).json({message: 'Не валидный access'})
  }
}

module.exports = verifyAccessToken