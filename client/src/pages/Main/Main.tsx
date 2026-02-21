import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import $api from '../../../shared/axios.instance'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


type BookAuthor = {
    id: number
    name: string
}

type Book = {
    id: number
    title: string
    description: string | null
    publish_year: number | null
    cover_url: string | null
    author: BookAuthor | null
}

type BooksResponse = {
    items: Book[]
    total: number
    page: number
    limit: number
}

type FavoritesResponse = {
    items: Array<{ id: number }>
}

type FiltersForm = {
    title: string
    author: string
    year: string
    onlyFavorites: boolean
}

function Main() {
    const [books, setBooks] = useState<Book[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [brokenCovers, setBrokenCovers] = useState<Set<number>>(new Set())
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set())
    const [pendingLikes, setPendingLikes] = useState<Set<number>>(new Set())

    const { control, register, watch } = useForm<FiltersForm>({
        defaultValues: {
            title: '',
            author: 'all',
            year: 'all',
            onlyFavorites: false
        }
    })

    useEffect(() => {
        let isActive = true

        const loadBooks = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const { data } = await $api.get<BooksResponse>('/books', {
                    params: { limit: 100 }
                })
                const { data: favoritesData } = await $api.get<FavoritesResponse>('/me/favorites', {
                    params: { limit: 100 }
                })

                if (isActive) {
                    setBooks(data.items)
                    setFavoriteIds(new Set(favoritesData.items.map((book) => book.id)))
                }
            } catch (err) {
                console.error(err)
                if (isActive) {
                    setError('Failed to load books')
                }
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        loadBooks()

        return () => {
            isActive = false
        }
    }, [])

    const toggleFavorite = async (bookId: number, isFavorite: boolean) => {
        setPendingLikes((prev) => new Set(prev).add(bookId))

        try {
            if (isFavorite) {
                await $api.delete(`/books/${bookId}/favorite`)
                setFavoriteIds((prev) => {
                    const next = new Set(prev)
                    next.delete(bookId)
                    return next
                })
                return
            }

            await $api.post(`/books/${bookId}/favorite`)
            setFavoriteIds((prev) => new Set(prev).add(bookId))
        } catch (err) {
            console.error(err)
        } finally {
            setPendingLikes((prev) => {
                const next = new Set(prev)
                next.delete(bookId)
                return next
            })
        }
    }

    const titleQuery = watch('title')
    const selectedAuthor = watch('author')
    const selectedYear = watch('year')
    const onlyFavorites = watch('onlyFavorites')

    const authors = useMemo(() => {
        const unique = new Map<number, string>()

        for (const book of books) {
            if (book.author) {
                unique.set(book.author.id, book.author.name)
            }
        }

        return [...unique.entries()]
            .map(([id, name]) => ( { id: String(id), name } ))
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [books])

    const years = useMemo(() => {
        const uniqueYears = new Set<number>()

        for (const book of books) {
            if (book.publish_year) {
                uniqueYears.add(book.publish_year)
            }
        }

        return [...uniqueYears].sort((a, b) => b - a)
    }, [books])

    const filteredBooks = useMemo(() => {
        const normalizedTitle = titleQuery.trim()
                                          .toLowerCase()

        return books.filter((book) => {
            const matchesTitle = !normalizedTitle || book.title.toLowerCase()
                                                         .includes(normalizedTitle)
            const matchesAuthor =
                selectedAuthor === 'all' || String(book.author?.id ?? '') === selectedAuthor
            const matchesYear =
                selectedYear === 'all' || String(book.publish_year ?? '') === selectedYear
            const matchesFavorite = !onlyFavorites || favoriteIds.has(book.id)

            return matchesTitle && matchesAuthor && matchesYear && matchesFavorite
        })
    }, [books, favoriteIds, onlyFavorites, selectedAuthor, selectedYear, titleQuery])

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
            <div className="flex items-center justify-start gap-2">
                <Button asChild>
                    <Link to="/books/create">Добавить книгу</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Поиск</CardTitle>
                    <CardDescription>Найди свою самую любимую книгу</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Название</Label>
                            <Controller
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <Input
                                        id="title"
                                        placeholder="Найди книгу по названию"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="author">Автор</Label>
                            <select
                                id="author"
                                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                                {...register('author')}
                            >
                                <option value="all">Все авторы</option>
                                {authors.map((author) => (
                                    <option key={author.id} value={author.id}>
                                        {author.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="year">Год</Label>
                            <select
                                id="year"
                                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                                {...register('year')}
                            >
                                <option value="all">За все время</option>
                                {years.map((year) => (
                                    <option key={year} value={String(year)}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <label className="flex items-center gap-2 md:col-span-3" htmlFor="onlyFavorites">
                            <input
                                id="onlyFavorites"
                                type="checkbox"
                                className="h-4 w-4"
                                {...register('onlyFavorites')}
                            />
                            <span className="text-sm">Мои любимые книги</span>
                        </label>
                    </form>
                </CardContent>

            </Card>

            {isLoading && <p>Loading books...</p>}
            {!isLoading && error && <p className="text-red-600">{error}</p>}

            {!isLoading && !error && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredBooks.map((book) => (
                        <Link key={book.id} to={`/books/${book.id}`} className="block">
                            <Card className="relative h-full cursor-pointer transition-shadow hover:shadow-md">
                                <button
                                    type="button"
                                    className="bg-background/80 absolute top-3 right-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border"
                                    aria-label={favoriteIds.has(book.id) ? 'Удалить лайк' : 'Поставить лайк'}
                                    disabled={pendingLikes.has(book.id)}
                                    onClick={(event) => {
                                        event.preventDefault()
                                        event.stopPropagation()
                                        toggleFavorite(book.id, favoriteIds.has(book.id))
                                    }}
                                >
                                    <Heart
                                        className={`h-4 w-4 ${favoriteIds.has(book.id) ? 'fill-red-500 text-red-500' :
                                            'text-muted-foreground'}`}
                                    />
                                </button>
                                {book.cover_url && !brokenCovers.has(book.id) ? (
                                    <img
                                        src={book.cover_url}
                                        alt={`Cover for ${book.title}`}
                                        className="h-48 w-full rounded-t-xl object-cover"
                                        onError={() => {
                                            setBrokenCovers((prev) => {
                                                const next = new Set(prev)
                                                next.add(book.id)
                                                return next
                                            })
                                        }}
                                    />
                                ) : (
                                    <div className="bg-muted text-muted-foreground flex h-48 w-full items-center justify-center rounded-t-xl text-sm">
                                        Нет обложки
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle>{book.title}</CardTitle>
                                    <CardDescription>
                                        {book.author?.name ?? 'Unknown author'}
                                        {book.publish_year ? `, ${book.publish_year}` : ''}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground line-clamp-4 text-sm">
                                        {book.description || 'No description'}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            {!isLoading && !error && filteredBooks.length === 0 && (
                <p className="text-muted-foreground">Ничего не найдено по заданому фильтру</p>
            )}
        </main>
    )
}

export default Main
