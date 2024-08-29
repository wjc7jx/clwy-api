const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { UnauthorizedError } = require('../utils/errors');
const { success, failure } = require('../utils/response');

module.exports = async (req, res, next) => {
    try {
        // 判断Token是否存在
        const { token } = req.headers;
        if (!token) {
            throw new UnauthorizedError('当前接口需要认证才能访问。');
        }
        // 验证token是否正确
        const decoded = jwt.verify(token, process.env.SECRET);
        // 从jwt中解析出之前存入的用户ID
        const { id } = decoded;
        // 查询一下当前用户
        const user = await User.findByPk(id)
        if (!user) {
            throw new UnauthorizedError('用户不存在。');
        }
        if(user.role!==1){
            throw new UnauthorizedError('用户无权限。');
        }
        // 将用户信息挂载到req上，方便后续中间件使用
        req.user = user;
        // 加上next，才能继续执行后续中间件
        next();
    } catch (error) {
        failure(res, error);
    }
};
