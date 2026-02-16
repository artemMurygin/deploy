'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Genres extends Model {
        static associate(models) {
            Genres.belongsToMany(models.Books, {
                through: models.BookGenres,
                foreignKey: 'genre_id',
                otherKey: 'book_id',
                as: 'books'
            });
        }
    }

    Genres.init(
        {
            name: {type: DataTypes.STRING(80), allowNull: false, unique: true}
        },
        {
            sequelize,
            modelName: 'Genres',
            tableName: 'Genres',
            underscored: true,
            timestamps: true
        }
    );

    return Genres;
};