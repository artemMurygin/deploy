import './Registration.scss'
import { useNavigate } from 'react-router-dom'
import $api, { setAccessToken } from '../../../shared/axios.instance';
import { MainContext } from '../../context/MainContext.tsx';
import { useContext } from 'react';
import * as yup from 'yup';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Field, FieldError, FieldGroup } from '@/components/ui/field.tsx';
import { Controller, useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { yupResolver } from '@hookform/resolvers/yup';


const schema = yup.object({
    name: yup.string()
             .required('Поле обязательно для заполнения'),
    email: yup.string()
              .email('Введите почту корректно')
              .required('Поле обязательно для заполнения'),
    password: yup.string()
                 .required('Поле обязательно для заполнения')
})

type FormData = yup.InferType<typeof schema>


const Registration = () => {
    const navigate = useNavigate()
    const { setUser } = useContext(MainContext)

    const { handleSubmit, control } = useForm({
        mode: 'onBlur',
        delayError: 200,
        disabled: false,
        resolver: yupResolver(schema)
    });


    const handler = async (fd: FormData) => {
        const { name, email, password } = fd

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
        <div className="container">
            <Card className={'login'}>
                <form onSubmit={handleSubmit(handler)}>
                    <CardHeader>
                        <CardTitle>Зарегистрироваться</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field: { name }, field, fieldState: { invalid, error } }) => (
                                    <Field>
                                        <Label htmlFor={name}>Введите имя</Label>
                                        <Input
                                            {...field}
                                            id={name}
                                            placeholder={'Ваше имя'}
                                            aria-invalid={invalid}
                                        />
                                        {invalid && <FieldError errors={[error]} />}
                                    </Field>
                                )}
                            />
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
        </div>
    )
}

export default Registration