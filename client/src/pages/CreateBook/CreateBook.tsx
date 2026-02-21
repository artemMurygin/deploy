import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import $api from '../../../shared/axios.instance'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

type CreateBookForm = {
    title: string
    description: string
    publish_year: string
    cover_url: string
}

type CreatedBook = {
    id: number
}

function CreateBook() {
    const navigate = useNavigate()
    const [submitMessage, setSubmitMessage] = useState<string | null>(null)

    const { control, handleSubmit, formState: { isSubmitting } } = useForm<CreateBookForm>({
        defaultValues: {
            title: '',
            description: '',
            publish_year: '',
            cover_url: ''
        }
    })

    const onSubmit = async (formData: CreateBookForm) => {
        try {
            setSubmitMessage(null)

            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim() || null,
                publish_year: formData.publish_year.trim() ? Number(formData.publish_year) : null,
                cover_url: formData.cover_url.trim() || null,
                status: 'DRAFT'
            }

            const { data } = await $api.post<CreatedBook>('/books', payload)
            navigate(`/books/${data.id}`)
        } catch (error) {
            console.error(error)
            setSubmitMessage('Не удалось создать книгу. Проверьте права доступа.')
        }
    }

    return (
        <main className="mx-auto w-full max-w-3xl p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Создание книги</CardTitle>
                    <CardDescription>Заполните форму и нажмите "Сохранить"</CardDescription>
                </CardHeader>

                <CardContent>
                    <form id="create-book-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Название</Label>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Input id="title" placeholder="Введите название" {...field} />
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
                                    <Input id="publish_year" type="number" placeholder="2024" {...field} />
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cover_url">URL обложки</Label>
                            <Controller
                                name="cover_url"
                                control={control}
                                render={({ field }) => (
                                    <Input id="cover_url" placeholder="https://..." {...field} />
                                )}
                            />
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex items-center justify-between gap-3">
                    <Button asChild variant="outline">
                        <Link to="/">Назад</Link>
                    </Button>
                    <Button form="create-book-form" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </CardFooter>
            </Card>

            {submitMessage && <p className="mt-4 text-sm">{submitMessage}</p>}
        </main>
    )
}

export default CreateBook
