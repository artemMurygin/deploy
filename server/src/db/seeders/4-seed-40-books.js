'use strict';

const bcrypt = require('bcrypt');

const EXTRA_AUTHORS = [
    {email: 'author2@example.com', name: 'Author Two'},
    {email: 'author3@example.com', name: 'Author Three'},
    {email: 'author4@example.com', name: 'Author Four'}
];

module.exports = {
    async up(queryInterface) {
        const now = new Date();

        const password = await bcrypt.hash('password123', 10);

        for (const author of EXTRA_AUTHORS) {
            const [existing] = await queryInterface.sequelize.query(
                `SELECT id FROM "Users" WHERE email = :email LIMIT 1;`,
                {replacements: {email: author.email}}
            );

            if (existing.length === 0) {
                await queryInterface.bulkInsert('Users', [
                    {
                        email: author.email,
                        password,
                        name: author.name,
                        role: 'AUTHOR',
                        created_at: now,
                        updated_at: now
                    }
                ]);
            }
        }

        const [authors] = await queryInterface.sequelize.query(
            `SELECT id FROM "Users" WHERE role = 'AUTHOR' ORDER BY id ASC;`
        );

        if (!authors.length) {
            throw new Error('No authors found for books seeding');
        }

        const books = Array.from({length: 40}, (_, index) => {
            const num = index + 1;
            const authorId = authors[index % authors.length].id;

            return {
                title: `Seed Book ${num}`,
                description: `Auto-generated seed book number ${num}.`,
                author_id: authorId,
                isbn: `SEED-ISBN-40-${num}`,
                language: num % 3 === 0 ? 'ru' : 'en',
                publish_year: 1985 + (num % 40),
                pages: 120 + num * 7,
                cover_url: `https://picsum.photos/seed/book-${num}/600/900`,
                status: 'PUBLISHED',
                created_at: now,
                updated_at: now
            };
        });

        await queryInterface.bulkInsert('Books', books);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Books', {
            title: Array.from({length: 40}, (_, index) => `Seed Book ${index + 1}`)
        });

        await queryInterface.bulkDelete('Users', {
            email: EXTRA_AUTHORS.map((author) => author.email)
        });
    }
};
