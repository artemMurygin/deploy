const router = require('express').Router();
const booksController = require('../../controllers/books/books.controller');
const {requireRole} = require('../../middleware/requireRole');

router.get('/', booksController.list);
router.get('/:id', booksController.getById);

router.post('/', requireRole('AUTHOR', 'ADMIN'), booksController.create);
router.patch('/:id', booksController.update);
router.delete('/:id', booksController.remove);

module.exports = router;