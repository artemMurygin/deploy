const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {Users} = require('../../db/models');
const createToken = require('../../utils/createToken')
const cookieConfig = require('../../configs/cookie.config')
const verifyAccessToken = require('../../middleware/verifyAccessToken')

router.get('/', verifyAccessToken, (req, res) => {
    const {user} = res.locals
    res.json({message: 'Авторизация успешна', user})
})

router.post('/registration', async (req, res) => {
    const {name, email, password, role = 'USER'} = req.body;

    if (!(name && email && password && role)) {
        return res.status(409).json({
            error: 'Заполнена не вся информация'
        })
    }

    try {
        const [user, isCreated] = await Users.findOrCreate({
            where: {email},
            defaults: {name, email, password, role},
            raw: true
        })

        if (!isCreated) {
            return res.status(400)
                .json({message: 'Пользователь с таким логином уже существует'})
        }

        const {accessToken, refreshToken} = createToken({user})

        res
            .cookie('refreshToken', refreshToken, cookieConfig)
            .json({
                message: 'Регистрация успешна',
                user,
                accessToken
            })
    } catch (error) {
        console.log('Упал эндпоинд /registration', error)
        res.status(500).send('Упал эндпоинд /registration, извините')
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if (!(email && password)) {
        res.status(409).json({error: 'Заполнена не вся информация'})
        return
    }

    try {
        const user = await Users.scope('withPassword').findOne(
            {where: {email}, raw: true}
        )
        if (!user) {
            res.status(404).json({message: 'Пользователь не найден'})
            return
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            res.status(400).json({message: 'Неверный пароль'})
            return
        }

        delete user.password

        const {accessToken, refreshToken} = createToken({user})

        res
            .status(200)
            .cookie('refreshToken', refreshToken, cookieConfig)
            .json({message: 'Авторизация успешна', user, accessToken})

    } catch (error) {
        console.log('Упала ручка login', error)
        res.status(500).json({message: 'Упала ручка login'})
    }
})

router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken').json({message: 'OK'})
})

router.patch('/profile', verifyAccessToken, async (req, res) => {
    const { user: authUser } = res.locals;
    const { name, password } = req.body;

    const patch = {};

    if (typeof name === 'string') {
        const trimmedName = name.trim();
        if (!trimmedName) {
            return res.status(400).json({ message: 'Имя не может быть пустым' });
        }
        patch.name = trimmedName;
    }

    if (typeof password === 'string') {
        if (password.length < 6) {
            return res.status(400).json({ message: 'Пароль должен быть не короче 6 символов' });
        }
        patch.password = password;
    }

    if (!Object.keys(patch).length) {
        return res.status(400).json({ message: 'Нет данных для обновления' });
    }

    try {
        const user = await Users.findByPk(authUser.id);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        await user.update(patch);

        const safeUser = user.toJSON();
        const { accessToken, refreshToken } = createToken({ user: safeUser });

        res
            .status(200)
            .cookie('refreshToken', refreshToken, cookieConfig)
            .json({
                message: 'Профиль обновлен',
                user: safeUser,
                accessToken
            });
    } catch (error) {
        console.log('Упал эндпоинт /profile', error);
        res.status(500).json({ message: 'Упал эндпоинт /profile' });
    }
})


module.exports = router;
