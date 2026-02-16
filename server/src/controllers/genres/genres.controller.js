const genresService = require('../../services/genres/genres.service');

module.exports = {
    async list(req, res) {
        try {
            const items = await genresService.listGenres();
            res.json(items);
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    }
};