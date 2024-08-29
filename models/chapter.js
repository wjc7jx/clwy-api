'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // 例如，如果Chapter与Course有关联
      models.Chapter.belongsTo(models.Course,{as: 'course'});
    }
  }
  
  Chapter.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unsigned: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unsigned: true,
      validate: {
        notNull: { msg: '课程ID不能为空' },
        isInt: { msg: '课程ID必须是整数' }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '课程标题不能为空' },
        notEmpty: { msg: '课程标题不能为空' }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true // 或者根据您的需求设置为false
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true // 或者根据您的需求设置为false
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      unsigned: true,
      validate: {
        notNull: { msg: '排序不能为空' },
        isInt: { msg: '排序必须是整数' },
        min: { args: [1], msg: '排序值必须大于等于1' }
      }
    }
  }, {
    sequelize,
    modelName: 'Chapter',
    // tableName: 'Chapters' // 如果表名不是默认的'Chapters'，需要指定
  });

  return Chapter;
};
