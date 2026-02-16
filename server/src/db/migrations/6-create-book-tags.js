'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Book_tags', {
            book_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: 'Books', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            tag_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: 'Tags', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()')},
            updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()')}
        });

        await queryInterface.addConstraint('Book_tags', {
            type: 'primary key',
            fields: ['book_id', 'tag_id'],
            name: 'book_tags_pk'
        });

        await queryInterface.addIndex('Book_tags', ['tag_id'], {name: 'book_tags_tag_id_idx'});
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Book_tags');
    }
};