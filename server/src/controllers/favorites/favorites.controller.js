const favoritesService = require('../../services/favorites/favorites.service');

module.exports = {
    async add(req, res) {
        try {
            const user = res.locals.user;
            const bookId = Number(req.params.id);

            const result = await favoritesService.addFavorite({userId: user.id, bookId});

            if (result === null) return res.status(404).json({message: 'Book not found'});
            if (result === '__FORBIDDEN__') return res.status(403).json({message: 'Forbidden'});

            res.status(201).json({bookId, favorite: true});
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    },

    async remove(req, res) {
        try {
            const user = res.locals.user;
            const bookId = Number(req.params.id);

            const result = await favoritesService.removeFavorite({userId: user.id, bookId});

            if (result === null) return res.status(404).json({message: 'Book not found'});
            if (result === '__FORBIDDEN__') return res.status(403).json({message: 'Forbidden'});

            res.json({bookId, favorite: false});
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    },

    async listMy(req, res) {
        try {
            const user = res.locals.user;
            const data = await favoritesService.listMyFavorites({userId: user.id, query: req.query});
            res.json(data);
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    }
};