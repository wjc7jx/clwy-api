// 引入Express框架
const express = require('express');
// 创建路由器对象
const router = express.Router();
// 引入Category模型
const { Category,Course } = require('../../models');

const { Op } = require('sequelize');
const {
    NotFoundError,
    getModelRecord,
    success,
    failure
} = require('../../utils/response');
/* 
 * 接口1 - 查询分类列表（允许模糊查询,分页查询若不传参则默认显示第一页10条） 
 * GET  /admin/categories?name=xxx
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
            order: [['rank', 'ASC'],['id', 'DESC']],
            limit: pageSize, //文档要求使用limit和offset
            offset: (currentPage - 1) * pageSize //计算出当前页的偏移量
        };
        // 查询条件name为模糊查询
        if (query.name) {
            condition.where = { name: { [Op.like]: `%${query.name}%` } };
        }
        const { rows, count } = await Category.findAndCountAll(condition);//将findAll改为findAndCountAll，其返回的结果是一个对象，包含rows和count两个属性
        // 返回成功响应，包含分类列表
        success(res, '查询分类列表成功。', {
            categories: rows, //分类列表
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
 * 接口2 - 查询分类详情 
 * GET /admin/categories/:id
 * */
router.get('/:id', async function (req, res, next) {
    try {
        const category = await getModelRecord('Category',req.params.id)
        success(res, '查询分类详情成功。', { category })
    }
    catch (error) {
        failure(res, error)
    }
})

/*
 * 接口3 - 创建分类
 * POST /admin/categories
 * */
router.post('/', async function (req, res, next) {
    try {
        // 使用白名单过滤
        // const body={
        //     name:req.body.name,
        //     rank:req.body.rank
        // } //将此封装成函数，更新分类处使用
        const body = filterBody(req);
        const category = await Category.create(body);
        success(res, '创建分类成功。', { category }, 201)
    } catch (error) {
        failure(res, error)
    }
})
/*
 * 接口4 - 删除分类
 * DELETE /admin/categories/:id
 * */
router.delete('/:id', async function (req, res, next) {
    try {
        const category = await getModelRecord('Category',req.params.id);
        const count = await Course.count({where:{categoryId:req.params.id}})
        if(count>0){
            throw new Error('该分类下有课程，不能删除。');
        }
        await category.destroy();
        success(res, '删除分类成功。')
    } catch (error) {
        failure(res, error)
    }
})
/* 
 * 接口5 - 更新分类
 * PUT /admin/categories/:id
 * */
router.put('/:id', async function (req, res, next) {
    try {
        const category = await getModelRecord('Category',req.params.id);
        const body = filterBody(req);
        await category.update(body);
        success(res, '更新分类成功。', { category },)
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
        name: req.body.name,
        rank: req.body.rank
    }    
}

// 导出路由器
module.exports = router;