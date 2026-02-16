const router = require('express').Router();
const reviewsController = require('../../controllers/reviews/reviews.controller');

router.get('/books/:id/reviews', reviewsController.listForBook);
router.put('/books/:id/review', reviewsController.upsertMyForBook);

module.exports = router;