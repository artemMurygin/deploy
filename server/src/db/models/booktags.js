'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class BookTags extends Model {
        static associate() {
        }
    }

    BookTags.init(
        {
            book_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
            tag_id: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false}
        },
        {
            sequelize,
            modelName: 'BookTags',
            tableName: 'Book_tags',
            underscored: true,
            timestamps: true
        }
    );

    return BookTags;
};