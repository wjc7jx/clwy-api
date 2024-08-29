const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { Op } = require('sequelize');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/*登录*/

router.post('/sign_in', async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login) {
            throw new BadRequestError('邮箱/用户名不能为空。');
        }
        if (!password) {
            throw new BadRequestError('密码不能为空。');
        }
        // 查询条件：邮箱/用户名
        const condition = {
            where: {
                [Op.or]: [
                    { email: login },
                    { username: login }
                ]
            }
        }
        // 验证用户
        const user = await User.findOne(condition);
        if (!user) {
            throw new NotFoundError('用户不存在。');
        }
        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('密码错误。');
        }
        // 验证管理员
        if (user.role !== 1) {
            throw new UnauthorizedError('用户无权限。');
        }
        // 生成身份密钥
        const token=jwt.sign({
            id: user.id,
        }, process.env.SECRET, {
            expiresIn: '7d'
        })
        success(res, '登录成功。', {token});
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
