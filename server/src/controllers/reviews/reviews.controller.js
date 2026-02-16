const reviewsService = require('../../services/reviews/reviews.service');

module.exports = {
    async listForBook(req, res) {
        try {
            const bookId = Number(req.params.id);
            const data = await reviewsService.listReviewsForBook({bookId, query: req.query});
            if (data === null) return res.status(404).json({message: 'Book not found'});
            res.json(data);
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    },

    async upsertMyForBook(req, res) {
        try {
            const user = res.locals.user;
            const bookId = Number(req.params.id);

            const {rating, text} = req.body || {};
            const result = await reviewsService.upsertMyReview({
                userId: user.id,
                bookId,
                rating,
                text
            });

            if (result === null) return res.status(404).json({message: 'Book not found'});
            if (result === '__FORBIDDEN__') return res.status(403).json({message: 'Forbidden'});
            if (result === '__BAD_REQUEST__') {
                return res.status(400).json({message: 'Validation error', errors: ['rating must be integer 1..5']});
            }

            res.json(result);
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    }
};