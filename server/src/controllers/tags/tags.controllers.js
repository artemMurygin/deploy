const tagsService = require('../../services/tags/tags.services');

module.exports = {
    async list(req, res) {
        try {
            const items = await tagsService.listTags({q: req.query.q});
            res.json(items);
        } catch (e) {
            console.error(e);
            res.status(500).json({message: 'Internal error'});
        }
    }
};