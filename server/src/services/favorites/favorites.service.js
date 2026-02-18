const {Books, Favorites, Users, Genres, Tags} = require('../../db/models'); // поправь путь

async function addFavorite({userId, bookId}) {
    const book = await Books.findByPk(bookId, {attributes: ['id', 'status', 'author_id']});
    if (!book) return null;

    // Разрешаем добавлять в избранное только опубликованные (или автору свои)
    const canSee =
        book.status === 'PUBLISHED' || book.author_id === userId;
    if (!canSee) return '__FORBIDDEN__';

    await Favorites.findOrCreate({
        where: {user_id: userId, book_id: bookId},
        defaults: {user_id: userId, book_id: bookId}
    });

    return true;
}

async function removeFavorite({userId, bookId}) {
    const book = await Books.findByPk(bookId, {attributes: ['id', 'status', 'author_id']});
    if (!book) return null;

    const canSee =
        book.status === 'PUBLISHED' || book.author_id === userId;
    if (!canSee) return '__FORBIDDEN__';

    await Favorites.destroy({where: {user_id: userId, book_id: bookId}});
    return true;
}


async function listMyFavorites({userId, query}) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const {rows, count} = await Books.findAndCountAll({
        include: [
            // ✅ вот тут вместо Favorites
            {
                model: Users,
                as: 'favoritedBy',         // 👈 ДОЛЖНО совпадать с as в Books.belongsToMany
                where: {id: userId},
                attributes: [],
                through: {attributes: []},
                required: true
            },
            {model: Users, as: 'author', attributes: ['id', 'name', 'email', 'role']},
            {model: Genres, as: 'genres', through: {attributes: []}},
            {model: Tags, as: 'tags', through: {attributes: []}}
        ],
        distinct: true,
        order: [['created_at', 'DESC']],
        limit,
        offset
    });

    return {items: rows, total: count, page, limit};
}

module.exports = {addFavorite, removeFavorite, listMyFavorites};