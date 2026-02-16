'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // Получаем автора и пользователя
        const [[author]] = await queryInterface.sequelize.query(
            `SELECT id
             FROM "Users"
             WHERE email = 'author1@example.com' LIMIT 1;`
        );

        const [[user]] = await queryInterface.sequelize.query(
            `SELECT id
             FROM "Users"
             WHERE email = 'user1@example.com' LIMIT 1;`
        );

        // Получаем жанры и теги (без slug)
        const [Genres] = await queryInterface.sequelize.query(
            `SELECT id, name
             FROM "Genres";`
        );

        const [Tags] = await queryInterface.sequelize.query(
            `SELECT id, name
             FROM "Tags";`
        );

        // Добавляем книги
        await queryInterface.bulkInsert('Books', [
            {
                title: 'Neon City',
                description: 'Cyberpunk noir story.',
                author_id: author.id,
                isbn: 'ISBN-0001',
                language: 'en',
                publish_year: 2022,
                pages: 320,
                cover_url: null,
                status: 'PUBLISHED',
                created_at: now,
                updated_at: now
            },
            {
                title: 'Dragons of North',
                description: 'Epic fantasy with dragons and magic.',
                author_id: author.id,
                isbn: 'ISBN-0002',
                language: 'en',
                publish_year: 2020,
                pages: 540,
                cover_url: null,
                status: 'PUBLISHED',
                created_at: now,
                updated_at: now
            },
            {
                title: 'Draft Book Example',
                description: 'Visible only to author.',
                author_id: author.id,
                isbn: null,
                language: 'ru',
                publish_year: 2026,
                pages: 120,
                cover_url: null,
                status: 'DRAFT',
                created_at: now,
                updated_at: now
            }
        ]);

        // Получаем книги
        const [Books] = await queryInterface.sequelize.query(
            `SELECT id, title
             FROM "Books";`
        );

        const bookByTitle = Object.fromEntries(
            Books.map((b) => [b.title, b.id])
        );

        const genreByName = Object.fromEntries(
            Genres.map((g) => [g.name, g.id])
        );

        const tagByName = Object.fromEntries(
            Tags.map((t) => [t.name, t.id])
        );

        // Связи книга-жанр
        await queryInterface.bulkInsert('Book_genres', [
            {
                book_id: bookByTitle['Neon City'],
                genre_id: genreByName['Sci-Fi'],
                created_at: now,
                updated_at: now
            },
            {
                book_id: bookByTitle['Dragons of North'],
                genre_id: genreByName['Fantasy'],
                created_at: now,
                updated_at: now
            }
        ]);

        // Связи книга-теги
        await queryInterface.bulkInsert('Book_tags', [
            {
                book_id: bookByTitle['Neon City'],
                tag_id: tagByName['cyberpunk'],
                created_at: now,
                updated_at: now
            },
            {
                book_id: bookByTitle['Dragons of North'],
                tag_id: tagByName['dragons'],
                created_at: now,
                updated_at: now
            },
            {
                book_id: bookByTitle['Dragons of North'],
                tag_id: tagByName['magic'],
                created_at: now,
                updated_at: now
            }
        ]);

        // Избранное
        await queryInterface.bulkInsert('Favorites', [
            {
                user_id: user.id,
                book_id: bookByTitle['Neon City'],
                created_at: now,
                updated_at: now
            }
        ]);

        // Отзыв
        await queryInterface.bulkInsert('Reviews', [
            {
                user_id: user.id,
                book_id: bookByTitle['Neon City'],
                rating: 5,
                text: 'Loved it!',
                created_at: now,
                updated_at: now
            }
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('Reviews', null, {});
        await queryInterface.bulkDelete('Favorites', null, {});
        await queryInterface.bulkDelete('Book_tags', null, {});
        await queryInterface.bulkDelete('Book_genres', null, {});
        await queryInterface.bulkDelete('Books', null, {});
    }
};