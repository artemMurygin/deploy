import './Login.scss'
import {Link, useNavigate} from 'react-router-dom'
import $api, {setAccessToken} from '../../../shared/axios.instance';
import {MainContext} from '../../context/MainContext.tsx';
import * as React from 'react';
import {useContext} from 'react';

const Login = () => {
    const navigate = useNavigate()
    const {setUser} = useContext(MainContext)

    const handler: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()

        const fd = new FormData(event.target)
        const {name, email, password} = Object.fromEntries(fd)

        try {
            const {status, data} = await $api.post('/auth/login', {name, email, password})
            console.log(data)
            if (status === 200) {
                console.log('token', data.accessToken)
                setAccessToken(data.accessToken)
                setUser(data.user)
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="registration">
            <div className="registration__inner">
                <div className="registration__top">
                    <h1 className="registration__header">Добро пожаловать!</h1>
                    <p className="registration__decription">Войдите в Ваш аккаунт</p>
                </div>
                <div className="registration__card">
                    <form
                        className="registration__form"
                        onSubmit={handler}
                    >
                        <label className="registration__form-label" htmlFor="email">
                            E-mail
                        </label>
                        <div className="registration__form-input">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="artem@mail.ru"
                            />
                        </div>
                        <label className="registration__form-label" htmlFor="password">
                            Пароль
                        </label>
                        <div className="registration__form-input">
                            <input
                                id="password"
                                name="password"
                                type="password"
                            />
                        </div>
                        <button type="submit">Войти</button>
                    </form>
                </div>
                <div className="registration__bottom">
                    <p>Нет аккаунта?
                        <span>
              <Link to="/registration">Зарегистрироваться</Link>
            </span></p>
                </div>
            </div>
        </div>
    )
}

export default Login