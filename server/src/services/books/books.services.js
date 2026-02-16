const {Op, fn, col, literal} = require('sequelize');
const {Books, Users, Genres, Tags, Reviews} = require('../../db/models');
const {toArrayOfIds} = require('../../validators/books.validators');

function buildVisibilityWhere(reqUser) {
    // Публично: только PUBLISHED
    // Автор: PUBLISHED + свои DRAFT/ARCHIVED (можешь ограничить по желанию)
    if (!reqUser) return {status: 'PUBLISHED'};

    if (reqUser.role === 'ADMIN') return {}; // видит всё

    // видит все PUBLISHED + свои любые
    return {
        [Op.or]: [
            {status: 'PUBLISHED'},
            {author_id: reqUser.id}
        ]
    };
}

async function listBooks({reqUser, query}) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const where = {
        ...buildVisibilityWhere(reqUser)
    };

    // Поиск по title
    if (query.q) {
        where.title = {[Op.iLike]: `%${query.q}%`};
    }

    // Фильтр по author_id (например "onlyMy")
    if (query.onlyMy === 'true' && reqUser) {
        where.author_id = reqUser.id;
    }

    // include жанров/тегов
    const include = [
        {model: Users, as: 'author', attributes: ['id', 'name', 'email', 'role']},
        {model: Genres, as: 'genres', through: {attributes: []}, required: false},
        {model: Tags, as: 'tags', through: {attributes: []}, required: false}
    ];

    // Сортировка
    const sort = query.sort || 'new';
    const order =
        sort === 'title' ? [['title', 'ASC']]
            : sort === 'year' ? [['publish_year', 'DESC NULLS LAST']]
                : [['created_at', 'DESC']];

    const {rows, count} = await Books.findAndCountAll({
        where,
        include,
        distinct: true, // важно при M:N include, иначе count будет завышен
        order,
        limit,
        offset
    });

    return {items: rows, total: count, page, limit};
}

async function getBookById({reqUser, id}) {
    const book = await Books.findByPk(id, {
        include: [
            {model: Users, as: 'author', attributes: ['id', 'name', 'email', 'role']},
            {model: Genres, as: 'genres', through: {attributes: []}},
            {model: Tags, as: 'tags', through: {attributes: []}}
        ]
    });

    if (!book) return null;

    // Проверка видимости
    if (book.status === 'PUBLISHED') return book;

    if (!reqUser) return '__FORBIDDEN__';
    if (reqUser.role === 'ADMIN') return book;
    if (book.author_id === reqUser.id) return book;

    return '__FORBIDDEN__';
}

async function createBook({reqUser, body}) {
    const genresIds = toArrayOfIds(body.genres);
    const tagsIds = toArrayOfIds(body.tags);

    const book = await Books.create({
        title: body.title,
        description: body.description ?? null,
        author_id: reqUser.id,
        isbn: body.isbn ?? null,
        language: body.language ?? 'en',
        publish_year: body.publish_year ?? null,
        pages: body.pages ?? null,
        cover_url: body.cover_url ?? null,
        status: body.status ?? 'DRAFT'
    });

    // Связи (M:N)
    if (genresIds.length) await book.setGenres(genresIds);
    if (tagsIds.length) await book.setTags(tagsIds);

    return await Books.findByPk(book.id, {
        include: [
            {model: Users, as: 'author', attributes: ['id', 'name', 'email', 'role']},
            {model: Genres, as: 'genres', through: {attributes: []}},
            {model: Tags, as: 'tags', through: {attributes: []}}
        ]
    });
}

async function updateBook({reqUser, id, body}) {
    const book = await Books.findByPk(id);
    if (!book) return null;

    // Доступ: владелец или админ
    const isOwner = reqUser && book.author_id === reqUser.id;
    const isAdmin = reqUser && reqUser.role === 'ADMIN';
    if (!isOwner && !isAdmin) return '__FORBIDDEN__';

    // Обновление полей (разрешаем частично)
    const patch = {};
    const allowed = ['title', 'description', 'isbn', 'language', 'publish_year', 'pages', 'cover_url', 'status'];

    for (const key of allowed) {
        if (body[key] !== undefined) patch[key] = body[key];
    }

    await book.update(patch);

    // Обновление связей если передали
    if (body.genres !== undefined) {
        const genresIds = toArrayOfIds(body.genres);
        await book.setGenres(genresIds);
    }
    if (body.tags !== undefined) {
        const tagsIds = toArrayOfIds(body.tags);
        await book.setTags(tagsIds);
    }

    return await Books.findByPk(book.id, {
        include: [
            {model: Users, as: 'author', attributes: ['id', 'name', 'email', 'role']},
            {model: Genres, as: 'genres', through: {attributes: []}},
            {model: Tags, as: 'tags', through: {attributes: []}}
        ]
    });
}

async function removeBook({reqUser, id}) {
    const book = await Books.findByPk(id);
    if (!book) return null;

    const isOwner = reqUser && book.author_id === reqUser.id;
    const isAdmin = reqUser && reqUser.role === 'ADMIN';
    if (!isOwner && !isAdmin) return '__FORBIDDEN__';

    await book.destroy(); // cascade удалит связки, если FK с CASCADE на join-таблицах
    return true;
}

module.exports = {listBooks, getBookById, createBook, updateBook, removeBook};