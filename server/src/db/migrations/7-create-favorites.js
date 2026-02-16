'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Favorites', {
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
            created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()')},
            updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()')}
        });

        await queryInterface.addConstraint('Favorites', {
            type: 'primary key',
            fields: ['user_id', 'book_id'],
            name: 'favorites_pk'
        });

    },

    async down(queryInterface) {
        await queryInterface.dropTable('Favorites');
    }
};