const booksService = require('../../services/books/books.services');
const {validateCreateBook, validateUpdateBook} = require('../../validators/books.validators');

module.exports = {
    async list(req, res) {
        try {
            const data = await booksService.listBooks({reqUser: res.locals.user || null, query: req.query});
            res.json(data);
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    },

    async getById(req, res) {
        try {
            const id = Number(req.params.id);
            const book = await booksService.getBookById({reqUser: res.locals.user || null, id});

            if (book === null) return res.status(404).json({message: 'Not found'});
            if (book === '__FORBIDDEN__') return res.status(403).json({message: 'Forbidden'});

            res.json(book);
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    },

    async create(req, res) {
        try {
            const errors = validateCreateBook(req.body);
            if (errors.length) return res.status(400).json({message: 'Validation error', errors});

            const book = await booksService.createBook({reqUser: res.locals.user, body: req.body});
            res.status(201).json(book);
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    },

    async update(req, res) {
        try {
            const errors = validateUpdateBook(req.body);
            if (errors.length) return res.status(400).json({message: 'Validation error', errors});

            const id = Number(req.params.id);
            const book = await booksService.updateBook({reqUser: res.locals.user, id, body: req.body});

            if (book === null) return res.status(404).json({message: 'Not found'});
            if (book === '__FORBIDDEN__') return res.status(403).json({message: 'Forbidden'});

            res.json(book);
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    },

    async remove(req, res) {
        try {
            const id = Number(req.params.id);
            const ok = await booksService.removeBook({reqUser: res.locals.user, id});

            if (ok === null) return res.status(404).json({message: 'Not found'});
            if (ok === '__FORBIDDEN__') return res.status(403).json({message: 'Forbidden'});

            res.status(204).send();
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    }
};