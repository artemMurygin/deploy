'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Favorites extends Model {
        static associate() {
        }
    }

    Favorites.init(
        {
            user_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
            book_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false}
        },
        {
            sequelize,
            modelName: 'Favorites',
            tableName: 'Favorites',
            underscored: true,
            timestamps: true
        }
    );

    return Favorites;
};