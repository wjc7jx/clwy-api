// 引入所有模型
const models = require('../models');
const { NotFoundError, UnauthorizedError, BadRequestError } = require('./errors');
/**
 * 根据模型名称获取模型实例
 * @param {string} modelName - 模型名称
 */
function getModelByName(modelName) {
    const Model = models[modelName];
    if (!Model) {
        throw new NotFoundError(`模型 ${modelName} 不存在。`);
    }
    return Model;
}

/**
 * 公共方法：根据模型名称和ID查询记录
 * @param {string} modelName - 模型名称
 * @param {number} id - 记录ID
 * @param condition - 查询条件
 */
async function getModelRecord(modelName, id, condition) {
    const model = getModelByName(modelName);
    // 查询设置记录
    if (modelName === 'Setting') {
        const record = await model.findOne({});
        if (!record) {
            throw new NotFoundError(`设置记录不存在。`);
        }
        return record;
    }
    const record = await model.findByPk(id, condition);
    if (!record) {
        throw new NotFoundError(`ID:${id} 的记录不存在。`);
    }
    return record;
}

/**
 * 请求成功success函数
 * @param res
 * @param message
 * @param data
 * @param code
 */
function success(res, message, data = {}, code = 200) {
    res.status(code).json({
        status: true,
        message,
        data
    });
}

/**
 * 请求失败failure函数
 * @param res
 * @param error
 */
function failure(res, error) {
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message);
        return res.status(400).json({
            status: false,
            message: '请求参数错误。',
            errors
        });
    } else if (error.name === 'NotFoundError') {
        return res.status(404).json({
            status: false,
            message: '资源不存在',
            errors: [error.message]
        });
    } else if (error.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: false,
            message: '认证失败。',
            errors: [error.message]
        })
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: false,
            message: '认证失败。',
            errors: ['无效的token。']
        })
    } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: false,
            message: '认证失败。',
            errors: ['token已过期。']
        })
    } else if (error.name === 'BadRequestError') {
        return res.status(400).json({
            status: false,
            message: '请求参数错误。',
            errors: [error.message]
        })
    } else {
        return res.status(500).json({
            status: false,
            message: '服务器错误。',
            errors: [error.message]
        });
    }
}

module.exports = {

    getModelRecord,
    success,
    failure
};
