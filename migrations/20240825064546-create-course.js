'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED // 添加 UNSIGNED
      },
      categoryId: {
        allowNull: false, // 添加不为null
        type: Sequelize.INTEGER.UNSIGNED, // 添加 UNSIGNED
        index: true // 添加索引
      },
      userId: {
        allowNull: false, // 添加不为null
        type: Sequelize.INTEGER.UNSIGNED, // 添加 UNSIGNED
        index: true // 添加索引
      },
      name: {
        allowNull: false, // 添加不为null
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      recommended: {
        allowNull: false, // 添加不为null
        type: Sequelize.BOOLEAN,
        defaultValue: false, // 添加默认值
        index: true // 添加索引
      },
      introductory: {
        allowNull: false, // 添加不为null
        type: Sequelize.BOOLEAN,
        defaultValue: false, // 添加默认值
        index: true // 添加索引
      },
      content: {
        type: Sequelize.TEXT
      },
      likesCount: {
        allowNull: false, // 添加不为null
        type: Sequelize.INTEGER.UNSIGNED, // 添加 UNSIGNED
        defaultValue: 0 // 添加默认值
      },
      chaptersCount: {
        allowNull: false, // 添加不为null
        type: Sequelize.INTEGER.UNSIGNED, // 添加 UNSIGNED
        defaultValue: 0 // 添加默认值
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
    await queryInterface.addIndex('Courses', {
      fields: ['categoryId']
    });
    await queryInterface.addIndex('Courses', {
      fields: ['userId']
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses');
  }
};