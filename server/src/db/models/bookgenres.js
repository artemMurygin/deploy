'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class BookGenres extends Model {
        static associate() {
        }
    }

    BookGenres.init(
        {
            book_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
            genre_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false}
        },
        {
            sequelize,
            modelName: 'BookGenres',
            tableName: 'Book_genres',
            underscored: true,
            timestamps: true
        }
    );

    return BookGenres;
};