'use strict';
/**
 * 定义一个迁移模块，用于数据库模式的变更
 * 该模块导出一个包含up和down方法的对象，分别用于应用和回滚数据库变更
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  /**
   * 执行数据库迁移的升级操作
   * 此方法创建一个名为'Articles'的表，并定义了几个列，包括id、title、content、createdAt和updatedAt
   * @param {Object} queryInterface - Sequelize提供的用于执行原生SQL查询的接口
   * @param {Object} Sequelize - Sequelize构造函数，用于定义模型和数据类型
   * @returns {Promise} - 返回一个Promise，表示异步操作的完成
   */
  
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      rank: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER.UNSIGNED
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
  },

  /**
   * 执行数据库迁移的降级操作，用于撤销up方法所做的变更
   * 此方法删除'Articles'表
   * @param {Object} queryInterface - Sequelize提供的用于执行原生SQL查询的接口
   * @param {Object} Sequelize - Sequelize构造函数，用于定义模型和数据类型
   * @returns {Promise} - 返回一个Promise，表示异步操作的完成
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Articles');
  }
};