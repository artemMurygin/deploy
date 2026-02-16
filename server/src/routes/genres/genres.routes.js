const router = require('express').Router();
const genresController = require('../../controllers/genres/genres.controller');

router.get('/', genresController.list);

module.exports = router;