'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Books', {
            id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},

            title: {type: Sequelize.STRING(300), allowNull: false},
            description: {type: Sequelize.TEXT, allowNull: true},

            author_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {model: 'Users', key: 'id'},
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            isbn: {type: Sequelize.STRING(32), allowNull: true, unique: true},
            language: {type: Sequelize.STRING(10), allowNull: false, defaultValue: 'en'},
            publish_year: {type: Sequelize.INTEGER, allowNull: true},
            pages: {type: Sequelize.INTEGER, allowNull: true},
            cover_url: {type: Sequelize.TEXT, allowNull: true},

            status: {
                type: Sequelize.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
                allowNull: false,
                defaultValue: 'DRAFT'
            },

            created_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()')},
            updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('NOW()')}
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('Books');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_books_status";');
    }
};