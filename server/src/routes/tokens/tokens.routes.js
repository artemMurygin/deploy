const cookieConfig = require('../../configs/cookie.config')
const verifyRefreshToken = require('../../middleware/verifyRefreshToken')
const createToken = require('../../utils/createToken')

const router = require('express').Router()

router.get('/refresh', verifyRefreshToken, (req, res) => {
    const { user } = res.locals
    const { accessToken, refreshToken } = createToken({ user })
    res
        .status(200)
        .cookie('refreshToken', refreshToken, cookieConfig)
        .json({ accessToken })
})

module.exports = router