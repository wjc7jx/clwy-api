'use strict';
const bcrypt=require('bcryptjs');
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'admin@clwy.cn',
        username: 'admin',
        password: bcrypt.hashSync('123123', 10),
        nickname: '超厉害的管理员',
        sex: 2,
        role: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user1@clwy.cn',
        username: 'user1',
        password: bcrypt.hashSync('123123', 10),
        nickname: '普通用户1',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@clwy.cn',
        username: 'user2',
        password: bcrypt.hashSync('123123', 10),
        nickname: '普通用户2',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user3@clwy.cn',
        username: 'user3',
        password: bcrypt.hashSync('123123', 10),
        nickname: '普通用户3',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user4@clwy.cn',
        username: 'user4',
        password: bcrypt.hashSync('123123', 10),
        nickname: '普通用户4',
        sex: 0,
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // 回滚操作：批量删除插入的数据
    await queryInterface.bulkDelete('Users', null, {});
  }
};
