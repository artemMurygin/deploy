'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Book_genres', {
            book_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: 'Books', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            genre_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: 'Genres', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()')},
            updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()')}
        });

        await queryInterface.addConstraint('Book_genres', {
            type: 'primary key',
            fields: ['book_id', 'genre_id'],
            name: 'book_genres_pk'
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Book_genres');
    }
};