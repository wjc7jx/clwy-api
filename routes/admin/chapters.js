// 引入Express框架
const express = require('express');
// 创建路由器对象
const router = express.Router();
// 引入Chapter模型
const { Chapter, Course } = require('../../models');

const { Op } = require('sequelize');
const {
    NotFoundError,
    getModelRecord,
    success,
    failure
} = require('../../utils/response');
/* 
 * 接口1 - 查询章节列表（允许模糊查询,分页查询若不传参则默认显示第一页10条） 
 * GET  /admin/chapters?title=xxx
 * */
router.get('/', async function (req, res, next) {
    try {
        const query = req.query;
        // 查询条件currentPage和pageSize为可选参数（分页）
        // 当前是第几页，如果不传，那就是第一页(Math.abs是绝对值，Number是将字符串转换为数字)
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        // 每页显示多少条数据，如果不传，那就显示10条
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        // 查询课程id不能为空
        if(!query.courseId){
            throw new Error('获取章节列表失败，课程ID不能为空');
        }
        const condition = {
            ...getCondition(),
            order: [['rank', 'ASC'], ['id', 'DESC']],
            limit: pageSize, //文档要求使用limit和offset
            offset: (currentPage - 1) * pageSize //计算出当前页的偏移量
        };
        condition.where = { courseId: { [Op.eq]: query.courseId } };
        // 查询条件title为模糊查询
        if (query.title) {
            condition.where = { title: { [Op.like]: `%${query.title}%` } };
        }
        const { rows, count } = await Chapter.findAndCountAll(condition);//将findAll改为findAndCountAll，其返回的结果是一个对象，包含rows和count两个属性
        // 返回成功响应，包含章节列表
        success(res, '查询章节列表成功。', {
            chapters: rows, //章节列表
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
 * 接口2 - 查询章节详情 
 * GET /admin/chapters/:id
 * */
router.get('/:id', async function (req, res, next) {
    try {
        const chapter = await getModelRecord('Chapter', req.params.id, getCondition());
        success(res, '查询章节详情成功。', { chapter })
    }
    catch (error) {
        failure(res, error)
    }
})

/*
 * 接口3 - 创建章节
 * POST /admin/chapters
 * */
router.post('/', async function (req, res, next) {
    try {
        // 使用白名单过滤
        // const body={
        //     title:req.body.title,
        //     content:req.body.content
        // } //将此封装成函数，更新章节处使用
        const body = filterBody(req);
        const chapter = await Chapter.create(body);
        success(res, '创建章节成功。', { chapter }, 201)
    } catch (error) {
        failure(res, error)
    }
})
/*
 * 接口4 - 删除章节
 * DELETE /admin/chapters/:id
 * */
router.delete('/:id', async function (req, res, next) {
    try {
        const chapter = await getModelRecord('Chapter', req.params.id);
        await chapter.destroy();
        success(res, '删除章节成功。')
    } catch (error) {
        failure(res, error)
    }
})
/* 
 * 接口5 - 更新章节
 * PUT /admin/chapters/:id
 * */
router.put('/:id', async function (req, res, next) {
    try {
        const chapter = await getModelRecord('Chapter', req.params.id);
        const body = filterBody(req);
        await chapter.update(body);
        success(res, '更新章节成功。', { chapter },)
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
        courseId: req.body.courseId,
        title: req.body.title,
        content: req.body.content,
        video: req.body.video,
        rank: req.body.rank
    }
}

// // get添加关联的字段的condition
function getCondition() {
    const condition = {
        attributes: { exclude: ['courseId'] },
        include: [
            { model: Course, as: 'course', attributes: ['id', 'name'] },
        ]
    }
    return condition

}
// 导出路由器
module.exports = router;