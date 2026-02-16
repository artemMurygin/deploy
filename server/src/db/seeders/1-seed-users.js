'use strict';

const bcrypt = require('bcrypt');

module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const password = await bcrypt.hash('password123', 10);

        await queryInterface.bulkInsert('Users', [
            {
                email: 'author1@example.com',
                password: password,
                name: 'Author One',
                role: 'AUTHOR',
                created_at: now,
                updated_at: now
            },
            {
                email: 'user1@example.com',
                password: password,
                name: 'User One',
                role: 'USER',
                created_at: now,
                updated_at: now
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Users', {
            email: ['author1@example.com', 'user1@example.com']
        });
    }
};