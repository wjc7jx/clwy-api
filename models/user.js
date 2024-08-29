'use strict';
const {
  Model,
  DataTypes,
  ValidationError,
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Course,{as: 'courses'});
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: '邮箱地址无效。'
        },
        notEmpty: {
          msg: '邮箱地址不能为空。'
        },
        async isUnique(value) {
          const existingEmail = await User.findOne({ where: { email: value } });
          if (existingEmail) {
            throw new Error('该邮箱已被注册。');
          }
        }
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '用户名不能为空。'
        },
        len: {
          args: [3, 25],
          msg: '用户名必须在3到25个字符之间。'
        },
        async isUnique (value) {
          const existingUser = await User.findOne({ where: { username: value } });
          if (existingUser) {
            throw new Error('该用户名已被占用。');
          }
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '密码不能为空。'
        },
        set(value){
          if(value.length>=6&&value.length<=25){
            this.setDataValue('password', bcrypt.hashSync(value, 10));
          }else{
            throw new Error('密码必须在6到25个字符之间。');
          }
        }
      },
    },
    nickname: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '昵称不能为空。'
        },
      },
    },
    sex: {
      type: DataTypes.TINYINT,
      validate: {
        isIn: {
          args: [[0, 1, 2]],
          msg: '性别必须是0（未知）、1（男）或2（女）。'
        },
      },
    },
    company: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: '公司名称不能为空。',
          args: [true],
        },
      },
    },
    introduce: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: '个人介绍不能为空。',
          args: [true],
        },
      },
    },
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: {
          args: [[0, 1]],
          msg: '角色必须是0（普通用户）或1（管理员）。'
        },
      },
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: '头像必须是有效的URL地址。'
        },
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  // 自定义密码强度验证
  // User.addHook('beforeValidate', (user, options) => {
  //   if (user.password && !user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
  //     throw new ValidationError('密码必须包含至少一个大写字母、一个小写字母和一个数字。');
  //   }
  // });

  return User;
};
