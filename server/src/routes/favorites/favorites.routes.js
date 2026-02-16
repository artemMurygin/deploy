const router = require('express').Router();
const favoritesController = require('../../controllers/favorites/favorites.controller');

router.get('/me/favorites', favoritesController.listMy);
router.post('/books/:id/favorite', favoritesController.add);
router.delete('/books/:id/favorite', favoritesController.remove);

module.exports = router;