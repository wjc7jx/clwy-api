// 引入Express框架
const express = require('express');
// 创建路由器对象
const router = express.Router();
// 引入User模型
const { User } = require('../../models');

const { Op } = require('sequelize');
const {
    NotFoundError,
    getModelRecord,
    success,
    failure
} = require('../../utils/response');
/* 
 * 接口1 - 查询用户列表（允许模糊查询,分页查询若不传参则默认显示第一页10条） 
 * GET  /admin/users?title=xxx
 * */
router.get('/', async function (req, res, next) {
    try {
        const query = req.query;
        // 查询条件currentPage和pageSize为可选参数（分页）
        // 当前是第几页，如果不传，那就是第一页(Math.abs是绝对值，Number是将字符串转换为数字)
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        // 每页显示多少条数据，如果不传，那就显示10条
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const condition = {
            order: [['id', 'DESC']],
            limit: pageSize, //文档要求使用limit和offset
            offset: (currentPage - 1) * pageSize //计算出当前页的偏移量
        };
        // 模糊查询
        if (query.email) {
            condition.where = { email: { [Op.eq]: query.email } };
        }
        if (query.username) {
            condition.where = { username: { [Op.eq]: query.username } };
        }
        if (query.nickname) {
            condition.where = { nickname: { [Op.like]: `%${query.nickname}%` } };
        }
        if (query.role) {
            condition.where = { role: { [Op.eq]: query.role } };
        }
        const { rows, count } = await User.findAndCountAll(condition);//将findAll改为findAndCountAll，其返回的结果是一个对象，包含rows和count两个属性
        // 返回成功响应，包含用户列表
        success(res, '查询用户列表成功。', {
            users: rows, //用户列表
            pagination: {
                currentPage, //当前页码
                pageSize, //每页显示多少条数据
                total: count //总条数
            }
        })
    } catch (error) {
        // 发生错误时返回错误响应
        failure(res, error)
    }
});
/* 
 * 接口2 - 查询用户详情 
 * GET /admin/users/:id
 * */
router.get('/:id', async function (req, res, next) {
    try {
        const user = await getModelRecord('User',req.params.id)
        success(res, '查询用户详情成功。', { user })
    }
    catch (error) {
        failure(res, error)
    }
})

/*
 * 接口3 - 创建用户
 * POST /admin/users
 * */
router.post('/', async function (req, res, next) {
    try {
        // 使用白名单过滤
        // const body={
        //     title:req.body.title,
        //     content:req.body.content
        // } //将此封装成函数，更新用户处使用
        const body = filterBody(req);
        const user = await User.create(body);
        success(res, '创建用户成功。', { user }, 201)
    } catch (error) {
        failure(res, error)
    }
})

/* 
 * 接口4 - 更新用户
 * PUT /admin/users/:id
 * */
router.put('/:id', async function (req, res, next) {
    try {
        const user = await getModelRecord('User',req.params.id);
        const body = filterBody(req);
        await user.update(body);
        success(res, '更新用户成功。', { user },)
    } catch (error) {
        failure(res, error)
    }
})

/*
 *公共办法：白名单过滤
 *@param req
 *return body
 * */
function filterBody(req) {
    return {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        nickname: req.body.nickname,
        role: req.body.role,
        sex: req.body.sex,
        avatar: req.body.avatar,
        company: req.body.company,
        introduce: req.body.introduce
    }
}

// 导出路由器
module.exports = router;