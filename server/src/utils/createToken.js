const jwt = require('jsonwebtoken')
const { accessToken, refreshToken } = require('../configs/token.config')

function createToken(payload){
  return {
    accessToken: jwt.sign(payload, process.env.SECRET_ACCESS, accessToken ),
    refreshToken: jwt.sign(payload, process.env.SECRET_REFRESH, refreshToken )
  }
}

module.exports = createToken