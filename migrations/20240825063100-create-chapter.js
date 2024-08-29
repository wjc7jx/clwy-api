'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chapters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED // 添加 UNSIGNED
      },
      courseId: {
        allowNull: false, // 添加不为null
        type: Sequelize.INTEGER.UNSIGNED, // 添加 UNSIGNED
        index: true // 添加索引
      },
      title: {
        allowNull: false, // 添加不为null
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      video: {
        type: Sequelize.STRING
      },
      rank: {
        allowNull: false, // 添加不为null
        type: Sequelize.INTEGER.UNSIGNED, // 添加 UNSIGNED
        defaultValue: 1 // 添加默认值
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // 索引courseId
    await queryInterface.addIndex('Chapters', {
      fields: ['courseId']
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chapters');
  }
};