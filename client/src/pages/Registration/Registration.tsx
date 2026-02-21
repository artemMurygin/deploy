import './Registration.scss'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Field, FieldError, FieldGroup } from '@/components/ui/field.tsx';
import { Controller, useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '@/redux/store.ts';
import { userRegisterThunk } from '../../redux/user.slice.ts'


const schema = yup.object({
    name: yup.string()
             .required('Поле обязательно для заполнения'),
    email: yup.string()
              .email('Введите почту корректно')
              .required('Поле обязательно для заполнения'),
    password: yup.string()
                 .required('Поле обязательно для заполнения'),
    role: yup.string()
             .oneOf(['USER', 'AUTHOR'], 'Выберите роль')
             .required('Поле обязательно для заполнения')
})

type FormData = yup.InferType<typeof schema>


const Registration = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { handleSubmit, control } = useForm<FormData>({
        mode: 'onBlur',
        delayError: 200,
        disabled: false,
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            role: 'USER'
        }
    });


    const handler = async (fd: FormData) => {
        const { name, email, password, role } = fd

        try {
            await dispatch(
                userRegisterThunk({ name, email, password, role })
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
                            <Controller
                                name="role"
                                control={control}
                                render={({ field: { name }, field, fieldState: { invalid, error } }) => (
                                    <Field>
                                        <Label htmlFor={name}>Выберите роль</Label>
                                        <select
                                            {...field}
                                            id={name}
                                            className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                                            aria-invalid={invalid}
                                        >
                                            <option value="USER">Пользователь</option>
                                            <option value="AUTHOR">Автор</option>
                                        </select>
                                        {invalid && <FieldError errors={[error]} />}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Зарегистрироваться</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

export default Registration
