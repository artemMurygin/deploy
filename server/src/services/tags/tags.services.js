const {Op} = require('sequelize');
const {Tags} = require('../../db/models'); // поправь путь

async function listTags({q}) {
    const where = {};
    if (q && String(q).trim()) {
        where.name = {[Op.iLike]: `%${String(q).trim()}%`};
    }

    return Tags.findAll({
        where,
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
        limit: 20 // для автокомплита достаточно
    });
}

module.exports = {listTags};