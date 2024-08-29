'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED // 修改为无符号整数
      },
      email: {
        allowNull: false, // 添加不为null
        type: Sequelize.STRING,
        unique: true // 添加unique索引
      },
      username: {
        allowNull: false, // 添加不为null
        type: Sequelize.STRING,
        unique: true // 添加unique索引
      },
      password: {
        allowNull: false, // 添加不为null
        type: Sequelize.STRING
      },
      nickname: {
        allowNull: false, // 添加不为null
        type: Sequelize.STRING
      },
      sex: {
        allowNull: false, // 添加不为null
        type: Sequelize.TINYINT.UNSIGNED, // 修改为无符号整数
        defaultValue: 9 // 添加默认值
      },
      company: {
        type: Sequelize.STRING
      },
      introduce: {
        type: Sequelize.TEXT
      },
      role: {
        allowNull: false, // 添加不为null
        type: Sequelize.TINYINT.UNSIGNED, // 修改为无符号整数
        defaultValue: 0, // 添加默认值
        index: true // 添加索引
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
      // 为 email 字段添加唯一索引
      await queryInterface.addIndex('Users', {
        fields: ['email'],
        unique: true
      });
  
      // 为 username 字段添加唯一索引
      await queryInterface.addIndex('Users', {
        fields: ['username'],
        unique: true
      });
  
      // 为 role 字段添加索引
      await queryInterface.addIndex('Users', {
        fields: ['role']
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};