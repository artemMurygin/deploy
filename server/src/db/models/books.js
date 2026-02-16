'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Books extends Model {
        static associate(models) {
            Books.belongsTo(models.Users, {foreignKey: 'author_id', as: 'author'});

            Books.belongsToMany(models.Genres, {
                through: models.BookGenres,
                foreignKey: 'book_id',
                otherKey: 'genre_id',
                as: 'genres'
            });

            Books.belongsToMany(models.Tags, {
                through: models.BookTags,
                foreignKey: 'book_id',
                otherKey: 'tag_id',
                as: 'tags'
            });

            Books.belongsToMany(models.Users, {
                through: models.Favorites,
                foreignKey: 'book_id',
                otherKey: 'user_id',
                as: 'favoritedBy'
            });


            Books.hasMany(models.Reviews, {foreignKey: 'book_id', as: 'reviews'});
        }
    }

    Books.init(
        {
            title: {type: DataTypes.STRING(300), allowNull: false},
            description: {type: DataTypes.TEXT, allowNull: true},

            author_id: {type: DataTypes.INTEGER, allowNull: false},

            isbn: {type: DataTypes.STRING(32), allowNull: true, unique: true},
            language: {type: DataTypes.STRING(10), allowNull: false, defaultValue: 'en'},
            publish_year: {type: DataTypes.INTEGER, allowNull: true},
            pages: {type: DataTypes.INTEGER, allowNull: true},
            cover_url: {type: DataTypes.TEXT, allowNull: true},

            status: {
                type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
                allowNull: false,
                defaultValue: 'DRAFT'
            }
        },
        {
            sequelize,
            modelName: 'Books',
            tableName: 'Books',
            underscored: true,
            timestamps: true
        }
    );

    return Books;
};