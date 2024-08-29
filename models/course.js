'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Course.belongsTo(models.Category,{as: 'category'});
      models.Course.belongsTo(models.User,{as: 'user'});
      models.Course.hasMany(models.Chapter,{as: 'chapters'});
    }
  }
  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unsigned: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unsigned: true,
      validate: {
        notNull: {
          msg: '分类ID不能为空'
        },
        isInt: {
          msg: '分类ID必须是整数'
        },
        async isPresent(value) {
          const category = await sequelize.models.Category.findByPk(value);
          if (!category) { throw new Error(`ID为：${value} 的分类不存在。`); }
        }
        
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unsigned: true,
      validate: {
        notNull: {
          msg: '用户ID不能为空'
        },
        isInt: {
          msg: '用户ID必须是整数'
        },
        async isPresent(value) {
          const user = await sequelize.models.User.findByPk(value);
          if (!user) { throw new Error(`ID为：${value} 的用户不存在。`); }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '名称不能为空'
        },
        notEmpty: {
          msg: '名称不能为空'
        }
      }
    },
    image: DataTypes.STRING,
    recommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      unsigned: true
    },
    introductory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      unsigned: true
    },
    content: DataTypes.TEXT,
    likesCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      unsigned: true,
      validate: {
        min: 0,
        isInt: {
          msg: '点赞数量必须是整数'
        }
      }
    },
    chaptersCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      unsigned: true,
      validate: {
        min: 0,
        isInt: {
          msg: '章节数量必须是整数'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};
