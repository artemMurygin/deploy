'use strict';

module.exports = {
    async up(queryInterface) {
        const now = new Date();

        const genres = ['Fantasy', 'Sci-Fi', 'Detective', 'Romance'].map((name) => ({
            name,
            created_at: now,
            updated_at: now
        }));

        const tags = ['magic', 'dragons', 'cyberpunk', 'young adult', 'slow burn'].map((name) => ({
            name,
            created_at: now,
            updated_at: now
        }));

        await queryInterface.bulkInsert('Genres', genres);
        await queryInterface.bulkInsert('Tags', tags);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Genres', null, {});
        await queryInterface.bulkDelete('Tags', null, {});
    }
};