'use strict';
const bcrypt = require('bcrypt');

const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            Users.hasMany(models.Books, {foreignKey: 'author_id', as: 'books'});
            Users.belongsToMany(models.Books, {
                through: models.Favorites,
                foreignKey: 'user_id',
                otherKey: 'book_id',
                as: 'favoriteBooks'
            });

            Users.hasMany(models.Reviews, {foreignKey: 'user_id', as: 'reviews'});

        }

        toJSON() {
            const attributes = {...this.get()};
            delete attributes.created_at;
            delete attributes.updated_at;
            delete attributes.password;
            return attributes;
        }
    }

    Users.init(
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            role: {
                type: DataTypes.ENUM('USER', 'AUTHOR', 'ADMIN'),
                allowNull: false,
                defaultValue: 'USER'
            }
        },
        {
            sequelize,
            modelName: 'Users',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            defaultScope: {
                attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
            },
            scopes: {
                withPassword: {
                    attributes: {exclude: ['createdAt', 'updatedAt']}
                }
            }
        }
    );

    Users.beforeCreate(async (user) => {
        user.password = await bcrypt.hash(
            user.password,
            parseInt(process.env.BCRYPT_ROUNDS) || 10
        );
    });

    Users.beforeUpdate(async (user) => {
        if (user.changed('password')) {
            user.password = await bcrypt.hash(
                user.password,
                parseInt(process.env.BCRYPT_ROUNDS) || 10
            );
        }
    });

    return Users;
};