import './Registration.scss'
import { Link, useNavigate } from 'react-router-dom'
import $api, { setAccessToken } from '../../../shared/axios.instance';
import { MainContext } from '../../context/MainContext.tsx';
import * as React from 'react';
import { useContext } from 'react';


const Registration = () => {
    const navigate = useNavigate()
    const { setUser } = useContext(MainContext)


    const handler: React.SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()

        const { name, email, password } = Object.fromEntries(new FormData(event.target))

        try {
            const { status, data } = await $api.post('/auth/registration', { name, email, password })
            console.log(status)
            if (status === 200) {
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
                    <div className="registration__logo" />
                    <h1 className="registration__header">Добро пожаловать!</h1>
                    <p className="registration__decription">Создайте Ваш аккаунт</p>
                </div>
                <div className="registration__card">
                    <form
                        className="registration__form"
                        onSubmit={handler}>
                        <label
                            className="registration__form-label"
                            htmlFor="phone"
                        >
                            Email
                        </label>
                        <div className="registration__form-input">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="artem@mail.ru"
                                required
                            />
                        </div>
                        <label
                            className="registration__form-label"
                            htmlFor="name"
                        >
                            Имя
                        </label>
                        <div className="registration__form-input">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Артем"
                                required
                            />
                        </div>
                        <label
                            className="registration__form-label"
                            htmlFor="role"
                        >
                            Кто ты?
                        </label>
                        <div className="registration__form-input">
                            <select name="role" id="role">Кто ты такой?
                                <option value="client">Клиент</option>
                                <option value="employee">Сотрудник</option>
                            </select>
                        </div>
                        <label
                            className="registration__form-label"
                            htmlFor="password"
                        >
                            Пароль
                        </label>
                        <div className="registration__form-input">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="********"
                                required
                            />
                        </div>
                        <button type="submit">Зарегистрироваться</button>
                    </form>
                </div>
                <div className="registration__bottom">
                    <p>
                        Есть аккаунт?
                        <span>
              <Link to="/login">Войти</Link>
            </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Registration