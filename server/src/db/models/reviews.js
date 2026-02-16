'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Reviews extends Model {
        static associate(models) {
            Reviews.belongsTo(models.Users, {foreignKey: 'user_id', as: 'user'});
            Reviews.belongsTo(models.Books, {foreignKey: 'book_id', as: 'book'});
        }
    }

    Reviews.init(
        {
            user_id: {type: DataTypes.INTEGER, allowNull: false},
            book_id: {type: DataTypes.INTEGER, allowNull: false},

            rating: {type: DataTypes.INTEGER, allowNull: false},
            text: {type: DataTypes.TEXT, allowNull: true}
        },
        {
            sequelize,
            modelName: 'Reviews',
            tableName: 'Reviews',
            underscored: true,
            timestamps: true,
            indexes: [
                {unique: true, fields: ['user_id', 'book_id'], name: 'reviews_user_book_uq'}
            ]
        }
    );

    return Reviews;
};