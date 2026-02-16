'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Reviews', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},

            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: 'Users', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            book_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: 'Books', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            rating: {type: Sequelize.INTEGER, allowNull: false},
            text: {type: Sequelize.TEXT, allowNull: true},

            created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()')},
            updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()')}
        });

        await queryInterface.addConstraint('Reviews', {
            type: 'unique',
            fields: ['user_id', 'book_id'],
            name: 'reviews_user_book_uq'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Reviews');
    }
};