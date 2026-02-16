'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Tags extends Model {
        static associate(models) {
            Tags.belongsToMany(models.Books, {
                through: models.BookTags,
                foreignKey: 'tag_id',
                otherKey: 'book_id',
                as: 'books'
            });
        }
    }

    Tags.init(
        {
            name: {type: DataTypes.STRING(80), allowNull: false, unique: true}
        },
        {
            sequelize,
            modelName: 'Tags',
            tableName: 'Tags',
            underscored: true,
            timestamps: true
        }
    );

    return Tags;
};