const {Genres} = require('../../db/models');

async function listGenres() {
    return Genres.findAll({
        attributes: ['id', 'name'],
        order: [['name', 'ASC']]
    });
}

module.exports = {listGenres};