'use strict';
//** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Settings', [{
            name: '长乐未央',
            icp: '示例：ICP备xx号-xx',
            copyright: '示例：© 20xx xx Inc. All Rights Reserved.',
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Settings', null, {});
    }
};
