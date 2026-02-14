'use strict';
const bcrypt = require('bcrypt');

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate() {
    }

    toJSON() {
      const attributes = { ...this.get() };
      delete attributes.createdAt;
      delete attributes.updatedAt;
      delete attributes.password;
      return attributes;
    }
  }
  Users.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Users',
      defaultScope: {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      },
      scopes: {
        withPassword: {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      },
    },
  );

  Users.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(
      user.password,
      parseInt(process.env.BCRYPT_ROUNDS) || 10,
    );
  });

  Users.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(
        user.password,
        parseInt(process.env.BCRYPT_ROUNDS) || 10,
      );
    }
  });

  return Users;
};