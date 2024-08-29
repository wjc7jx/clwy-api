'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Courses', [
            { categoryId: 1, userId: 1, name: 'CSS入门', recommended: true, introductory: true, createdAt: new Date(), updatedAt: new Date() },
            { categoryId: 2, userId: 1, name: 'Node.js项目实践（2024版）', recommended: true, introductory: false, createdAt: new Date(), updatedAt: new Date() },
        ], {});
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Courses', null, {});
    }
};


