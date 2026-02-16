const {Reviews, Books, Users} = require('../../db/models'); // поправь путь

function isValidRating(r) {
    const n = Number(r);
    return Number.isInteger(n) && n >= 1 && n <= 5;
}

async function listReviewsForBook({bookId, query}) {
    const book = await Books.findByPk(bookId, {attributes: ['id']});
    if (!book) return null;

    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 50);
    const offset = (page - 1) * limit;

    const {rows, count} = await Reviews.findAndCountAll({
        where: {book_id: bookId},
        include: [{model: Users, as: 'user', attributes: ['id', 'name']}],
        order: [['created_at', 'DESC']],
        limit,
        offset
    });

    return {items: rows, total: count, page, limit};
}

async function upsertMyReview({userId, bookId, rating, text}) {
    const book = await Books.findByPk(bookId, {attributes: ['id', 'status', 'author_id']});
    if (!book) return null;

    const canSee = book.status === 'PUBLISHED' || book.author_id === userId;
    if (!canSee) return '__FORBIDDEN__';

    if (!isValidRating(rating)) return '__BAD_REQUEST__';

    const [review] = await Reviews.findOrCreate({
        where: {user_id: userId, book_id: bookId},
        defaults: {user_id: userId, book_id: bookId, rating: Number(rating), text: text ?? null}
    });

    // если уже был — обновим
    if (!review.isNewRecord) {
        await review.update({rating: Number(rating), text: text ?? null});
    }

    return Reviews.findByPk(review.id, {
        include: [{model: Users, as: 'user', attributes: ['id', 'name']}]
    });
}

module.exports = {listReviewsForBook, upsertMyReview};