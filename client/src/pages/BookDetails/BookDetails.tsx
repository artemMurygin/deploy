import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import $api from '../../../shared/axios.instance'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppSelector } from '@/redux/store'


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

type BookForm = {
    title: string
    description: string
    publish_year: string
    cover_url: string
}

type Review = {
    id: number
    rating: number
    text: string | null
    created_at?: string
    user?: {
        id: number
        name: string
    } | null
}

type ReviewsResponse = {
    items: Review[]
}

function BookDetails() {
    const { id } = useParams<{ id: string }>()
    const currentUser = useAppSelector((store) => store.userState.user)
    const [book, setBook] = useState<Book | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [submitMessage, setSubmitMessage] = useState<string | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoadingReviews, setIsLoadingReviews] = useState(true)
    const [reviewsError, setReviewsError] = useState<string | null>(null)
    const [reviewText, setReviewText] = useState('')
    const [reviewRating, setReviewRating] = useState('5')
    const [reviewMessage, setReviewMessage] = useState<string | null>(null)
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)

    const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<BookForm>({
        defaultValues: {
            title: '',
            description: '',
            publish_year: '',
            cover_url: ''
        }
    })

    useEffect(() => {
        let isActive = true

        const loadBookAndReviews = async () => {
            if (!id) {
                setError('Book id is missing')
                setIsLoading(false)
                setIsLoadingReviews(false)
                return
            }

            try {
                setIsLoading(true)
                setIsLoadingReviews(true)
                setError(null)
                setReviewsError(null)

                const [{ data: bookData }, { data: reviewsData }] = await Promise.all([
                    $api.get<Book>(`/books/${id}`),
                    $api.get<ReviewsResponse>(`/books/${id}/reviews`, { params: { limit: 50 } })
                ])

                if (!isActive) return

                setBook(bookData)
                reset({
                    title: bookData.title ?? '',
                    description: bookData.description ?? '',
                    publish_year: bookData.publish_year ? String(bookData.publish_year) : '',
                    cover_url: bookData.cover_url ?? ''
                })
                setReviews(reviewsData.items)
            } catch (err) {
                console.error(err)
                if (isActive) {
                    setError('Failed to load book')
                    setReviewsError('Не удалось загрузить комментарии')
                }
            } finally {
                if (isActive) {
                    setIsLoading(false)
                    setIsLoadingReviews(false)
                }
            }
        }

        loadBookAndReviews()

        return () => {
            isActive = false
        }
    }, [id, reset])

    const loadReviews = async () => {
        if (!id) return

        try {
            setIsLoadingReviews(true)
            setReviewsError(null)

            const { data } = await $api.get<ReviewsResponse>(`/books/${id}/reviews`, {
                params: { limit: 50 }
            })
            setReviews(data.items)
        } catch (err) {
            console.error(err)
            setReviewsError('Не удалось загрузить комментарии')
        } finally {
            setIsLoadingReviews(false)
        }
    }

    const onSubmit = async (formData: BookForm) => {
        if (!id) return
        if (!canEdit) {
            setSubmitMessage('Редактирование запрещено: вы не автор книги')
            return
        }

        try {
            setSubmitMessage(null)

            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim() || null,
                publish_year: formData.publish_year.trim() ? Number(formData.publish_year) : null,
                cover_url: formData.cover_url.trim() || null
            }

            const { data } = await $api.patch<Book>(`/books/${id}`, payload)

            setBook(data)
            setSubmitMessage('Книга успешно сохранена')
        } catch (err) {
            console.error(err)
            setSubmitMessage('Не удалось сохранить книгу')
        }
    }

    const onReviewSubmit = async () => {
        if (!id) return

        const rating = Number(reviewRating)
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            setReviewMessage('Оценка должна быть от 1 до 5')
            return
        }

        try {
            setIsSubmittingReview(true)
            setReviewMessage(null)

            await $api.put(`/books/${id}/review`, {
                rating,
                text: reviewText.trim() || null
            })

            setReviewText('')
            setReviewRating('5')
            setReviewMessage('Комментарий отправлен')
            await loadReviews()
        } catch (err) {
            console.error(err)
            setReviewMessage('Не удалось отправить комментарий')
        } finally {
            setIsSubmittingReview(false)
        }
    }

    if (isLoading) {
        return <main className="mx-auto w-full max-w-3xl p-6">Loading book...</main>
    }

    if (error) {
        return (
            <main className="mx-auto w-full max-w-3xl p-6">
                <p className="text-red-600">{error}</p>
                <Button asChild variant="outline" className="mt-4">
                    <Link to="/">Назад к книгам</Link>
                </Button>
            </main>
        )
    }

    const canEdit = Boolean(currentUser?.id && book?.author?.id && currentUser.id === book.author.id)

    return (
        <main className="mx-auto w-full max-w-3xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Подробнее о книге</CardTitle>
                    <CardDescription>
                        Автор: {book?.author?.name ?? 'Unknown author'}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form id="book-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Название</Label>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Input id="title" disabled={!canEdit} {...field} />
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Описание</Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        id="description"
                                        className="border-input bg-background min-h-24 rounded-md border px-3 py-2 text-sm"
                                        disabled={!canEdit}
                                        {...field}
                                    />
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="publish_year">Год</Label>
                            <Controller
                                name="publish_year"
                                control={control}
                                render={({ field }) => (
                                    <Input id="publish_year" type="number" disabled={!canEdit} {...field} />
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cover_url">URL обложки</Label>
                            <Controller
                                name="cover_url"
                                control={control}
                                render={({ field }) => (
                                    <Input id="cover_url" placeholder="https://..." disabled={!canEdit} {...field} />
                                )}
                            />
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-3">
                    <Button asChild variant="outline">
                        <Link to="/">Назад</Link>
                    </Button>
                    <Button form="book-form" type="submit" disabled={isSubmitting || !canEdit}>
                        {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </CardFooter>
            </Card>

            {submitMessage && (
                <p className="mt-4 text-sm">{submitMessage}</p>
            )}

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Комментарии</CardTitle>
                    <CardDescription>Оставить комментарий может любой пользователь</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-3 rounded-md border p-4">
                        <div className="grid gap-2">
                            <Label htmlFor="review-rating">Оценка</Label>
                            <select
                                id="review-rating"
                                value={reviewRating}
                                onChange={(event) => setReviewRating(event.target.value)}
                                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                            >
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="review-text">Комментарий</Label>
                            <textarea
                                id="review-text"
                                value={reviewText}
                                onChange={(event) => setReviewText(event.target.value)}
                                className="border-input bg-background min-h-24 rounded-md border px-3 py-2 text-sm"
                                placeholder="Поделитесь впечатлением о книге"
                            />
                        </div>

                        <Button type="button" onClick={onReviewSubmit} disabled={isSubmittingReview}>
                            {isSubmittingReview ? 'Отправка...' : 'Отправить комментарий'}
                        </Button>
                        {reviewMessage && <p className="text-sm">{reviewMessage}</p>}
                    </div>

                    <div className="grid gap-3">
                        {isLoadingReviews && <p>Загрузка комментариев...</p>}
                        {!isLoadingReviews && reviewsError && <p className="text-red-600">{reviewsError}</p>}
                        {!isLoadingReviews && !reviewsError && reviews.length === 0 && (
                            <p>Комментариев пока нет.</p>
                        )}
                        {!isLoadingReviews && !reviewsError && reviews.length > 0 && reviews.map((review) => (
                            <div key={review.id} className="rounded-md border p-3">
                                <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                                    <span className="font-medium">{review.user?.name ?? 'Пользователь'}</span>
                                    <span className="text-muted-foreground">Оценка: {review.rating}/5</span>
                                </div>
                                <p className="text-sm">{review.text?.trim() ? review.text : 'Без текста'}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}

export default BookDetails
