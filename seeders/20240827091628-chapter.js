'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * 在这里插入种子数据到`Chapters`表中。
     * 您可以插入一个或多个条目。
     */

    // 示例数据
    const chaptersData = [
      {
        courseId: 1, // 假设这是课程的ID
        title: 'CSS入门第一章：介绍',
        content: '这是第一章的内容',
        video: 'https://example.com/video1.mp4',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: 1, // 假设这是同一个课程的ID
        title: 'CSS入门第二章：基础',
        content: '这是第二章的内容',
        video: 'https://example.com/video2.mp4',
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: 2, // 假设这是课程的ID
        title: 'Node.js项目实践第一章：介绍',
        content: '这是第一章的内容',
        video: 'https://example2.com/video1.mp4',
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        courseId: 2, // 假设这是同一个课程的ID
        title: 'Node.js项目实践第二章：基础',
        content: '这是第二章的内容',
        video: 'https://example2.com/video2.mp4',
        rank: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // ...您可以继续添加更多章节数据
    ];

    // 使用bulkInsert方法插入数据
    await queryInterface.bulkInsert('Chapters', chaptersData, {});

    // 注意：如果您的表有外键约束，确保courseId对应的课程存在。
  },

  async down (queryInterface, Sequelize) {
    /**
     * 添加命令以回滚种子数据。
     * 在这里，我们将删除之前插入的所有章节数据。
     */

    // 删除Chapters表中的所有数据
    await queryInterface.bulkDelete('Chapters', null, {});
  }
};
