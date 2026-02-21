import './Login.scss'
import { NavLink, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch } from '@/redux/store.ts';
import { userLoginThunk } from '@/redux/user.slice.ts';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Controller, useForm } from 'react-hook-form';


const schema = yup.object({
    email: yup.string()
              .email('Введите почту корреткно')
              .required('Поле обязательно для заполнения'),
    password: yup.string()
                 .required('Поле обязательно для заполнения')
})

type FormData = yup.InferType<typeof schema>

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { handleSubmit, control } = useForm({
        mode: 'onBlur',
        delayError: 200,
        disabled: false,
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const handler = async (fd: FormData) => {
        try {
            await dispatch(
                userLoginThunk(fd)
            )
                .unwrap()
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container">
            <Card className={'login'}>
                <form onSubmit={handleSubmit(handler)}>
                    <CardHeader>
                        <CardTitle>Войти в приложение</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field: { name }, field, fieldState: { invalid, error } }) => (
                                    <Field>
                                        <Label htmlFor={name}>Введите e-mail</Label>
                                        <Input
                                            {...field}
                                            id={name}
                                            placeholder={'username@pochta.ru'}
                                            aria-invalid={invalid}
                                        />
                                        {invalid && <FieldError errors={[error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={control}
                                render={({ field: { name }, field, fieldState: { invalid, error } }) => (
                                    <Field>
                                        <Label htmlFor={name}>Введите пароль</Label>
                                        <Input
                                            {...field}
                                            id={name}
                                            placeholder={'Ваш пароль'}
                                            aria-invalid={invalid}
                                        />
                                        {invalid && <FieldError errors={[error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Войти</Button>
                    </CardFooter>
                </form>
            </Card>
            <NavLink to={'/registration'}>Зарегистрироваться</ NavLink>
        </div>
    )
}

export default Login


// <div className="registration">
//     <div className="registration__inner">
//     <div className="registration__top">
//     <h1 className="registration__header">Добро пожаловать!</h1>
// <p className="registration__decription">Войдите в Ваш аккаунт</p>
// </div>
// <div className="registration__card">
//     <form
//         className="registration__form"
//         onSubmit={handler}
//     >
//         <label className="registration__form-label" htmlFor="email">
//             E-mail
//         </label>
//         <div className="registration__form-input">
//             <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="artem@mail.ru"
//             />
//         </div>
//         <label className="registration__form-label" htmlFor="password">
//             Пароль
//         </label>
//         <div className="registration__form-input">
//             <input
//                 id="password"
//                 name="password"
//                 type="password"
//             />
//         </div>
//         <button type="submit">Войти</button>
//     </form>
// </div>
// <div className="registration__bottom">
//     <p>Нет аккаунта?
//         <span>
//               <Link to="/registration">Зарегистрироваться</Link>
//             </span></p>
// </div>
// </div>
// </div>