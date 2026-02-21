import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import $api from '../../../shared/axios.instance'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { userLogoutThunk, userUpdateProfileThunk } from '@/redux/user.slice'


type FavoriteBook = {
    id: number
    title: string
    description: string | null
    publish_year: number | null
    author?: {
        id: number
        name: string
    } | null
}

type FavoritesResponse = {
    items: FavoriteBook[]
}

function Profile() {
    const dispatch = useAppDispatch()
    const user = useAppSelector((store) => store.userState.user)

    const [favorites, setFavorites] = useState<FavoriteBook[]>([])
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(true)
    const [favoritesError, setFavoritesError] = useState<string | null>(null)

    const [name, setName] = useState(user?.name ?? '')
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const [isSubmittingName, setIsSubmittingName] = useState(false)
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)

    useEffect(() => {
        setName(user?.name ?? '')
    }, [user?.name])

    useEffect(() => {
        let isActive = true

        const loadFavorites = async () => {
            try {
                setIsLoadingFavorites(true)
                setFavoritesError(null)

                const { data } = await $api.get<FavoritesResponse>('/me/favorites', {
                    params: { limit: 100 }
                })

                if (!isActive) return
                setFavorites(data.items)
            } catch (err) {
                console.error(err)
                if (isActive) {
                    setFavoritesError('Не удалось загрузить понравившиеся книги')
                }
            } finally {
                if (isActive) {
                    setIsLoadingFavorites(false)
                }
            }
        }

        loadFavorites()

        return () => {
            isActive = false
        }
    }, [])

    const submitName = async (event: FormEvent) => {
        event.preventDefault()

        const trimmedName = name.trim()
        if (!trimmedName) {
            setMessage('Имя не может быть пустым')
            return
        }

        try {
            setIsSubmittingName(true)
            setMessage(null)

            await dispatch(userUpdateProfileThunk({ name: trimmedName })).unwrap()
            setMessage('Имя успешно обновлено')
        } catch (error) {
            setMessage(typeof error === 'string' ? error : 'Не удалось обновить имя')
        } finally {
            setIsSubmittingName(false)
        }
    }

    const submitPassword = async (event: FormEvent) => {
        event.preventDefault()

        if (newPassword.length < 6) {
            setMessage('Пароль должен быть не короче 6 символов')
            return
        }

        try {
            setIsSubmittingPassword(true)
            setMessage(null)

            await dispatch(userUpdateProfileThunk({ password: newPassword })).unwrap()
            setNewPassword('')
            setMessage('Пароль успешно обновлен')
        } catch (error) {
            setMessage(typeof error === 'string' ? error : 'Не удалось обновить пароль')
        } finally {
            setIsSubmittingPassword(false)
        }
    }

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
            <div className="flex items-center justify-between gap-2">
                <h1 className="text-2xl font-semibold">Профиль</h1>
                <Button variant="outline" onClick={() => dispatch(userLogoutThunk())}>Выход</Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Изменить имя</CardTitle>
                        <CardDescription>Текущее имя: {user?.name ?? 'Пользователь'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="grid gap-3" onSubmit={submitName}>
                            <Label htmlFor="profile-name">Имя</Label>
                            <Input
                                id="profile-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Введите новое имя"
                            />
                            <Button type="submit" disabled={isSubmittingName}>
                                {isSubmittingName ? 'Сохранение...' : 'Сохранить имя'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Изменить пароль</CardTitle>
                        <CardDescription>Введите новый пароль для аккаунта</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="grid gap-3" onSubmit={submitPassword}>
                            <Label htmlFor="profile-password">Новый пароль</Label>
                            <Input
                                id="profile-password"
                                type="password"
                                value={newPassword}
                                onChange={(event) => setNewPassword(event.target.value)}
                                placeholder="Минимум 6 символов"
                            />
                            <Button type="submit" disabled={isSubmittingPassword}>
                                {isSubmittingPassword ? 'Сохранение...' : 'Сохранить пароль'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {message && <p className="text-sm">{message}</p>}

            <Card>
                <CardHeader>
                    <CardTitle>Понравившиеся книги</CardTitle>
                    <CardDescription>Список книг, которые вы отметили как любимые</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingFavorites && <p>Загрузка...</p>}
                    {!isLoadingFavorites && favoritesError && <p className="text-red-600">{favoritesError}</p>}
                    {!isLoadingFavorites && !favoritesError && favorites.length === 0 && (
                        <p>У вас пока нет понравившихся книг.</p>
                    )}
                    {!isLoadingFavorites && !favoritesError && favorites.length > 0 && (
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {favorites.map((book) => (
                                <Link
                                    key={book.id}
                                    to={`/books/${book.id}`}
                                    className="rounded-md border p-3 transition-colors hover:bg-muted"
                                >
                                    <p className="font-medium">{book.title}</p>
                                    <p className="text-sm text-muted-foreground">{book.author?.name ?? 'Неизвестный автор'}</p>
                                    {book.publish_year && <p className="text-xs text-muted-foreground">{book.publish_year}</p>}
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}

export default Profile
