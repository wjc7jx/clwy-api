// 引入Express框架
const express = require('express');
// 创建路由器对象
const router = express.Router();
// 引入Course模型
const { Course,Category,User,Chapter } = require('../../models');
const { Op } = require('sequelize');
const {
    NotFoundError,
    getModelRecord,
    success,
    failure
} = require('../../utils/response');

/* 
 * 接口1 - 查询课程列表（允许分页查询若不传参则默认显示第一页10条） 
 * GET  /admin/courses
 * */
router.get('/', async function (req, res, next) {
    try {
        const query = req.query;
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const condition = {
            ...getCondition(),
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: (currentPage - 1) * pageSize
        };

        if (query.name) {
            condition.where = { name: { [Op.like]: `%${query.name}%` } };
        }
        if (query.recommended) {
            condition.where = {
                recommended: {
                    //需要转布尔值
                    [Op.eq]: query.recommended === 'true'
                }
            };
        }
        if (query.introductory) {
            condition.where = {
                introductory: {
                    [Op.eq]: query.introductory === 'true'
                }
            };
        }


        const { rows, count } = await Course.findAndCountAll(condition);
        success(res, '查询课程列表成功。', {
            courses: rows,
            pagination: {
                currentPage,
                pageSize,
                total: count
            }
        });
    } catch (error) {
        failure(res, error);
    }
});

/* 
 * 接口2 - 查询课程详情 
 * GET /admin/courses/:id
 * */
router.get('/:id', async function (req, res, next) {
    try {
        const course = await getModelRecord('Course', req.params.id,getCondition());
        success(res, '查询课程详情成功。', { course });
    } catch (error) {
        failure(res, error);
    }
});

/*
 * 接口3 - 创建课程
 * POST /admin/courses
 * */
router.post('/', async function (req, res, next) {
    try {
        const body = filterBody(req);
        body.userId = req.user.id;
        const course = await Course.create(body);
        success(res, '创建课程成功。', { course }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/* 
 * 接口4 - 更新课程
 * PUT /admin/courses/:id
 * */
router.put('/:id', async function (req, res, next) {
    try {
        const course = await getModelRecord('Course', req.params.id);
        const body = filterBody(req);
        await course.update(body);
        success(res, '更新课程成功。', { course });
    } catch (error) {
        failure(res, error);
    }
});
/* 
 * 接口5 - 删除课程
 * DELETE /admin/courses/:id
 * */
router.delete('/:id', async function (req, res, next) {
    try {
        const course = await getModelRecord('Course', req.params.id);
        const count = await Chapter.count({where:{courseId:req.params.id}})
        if(count>0){
            throw new Error('该课程有章节，不能删除。');
        }
        if (!course) {
            throw new NotFoundError('课程不存在。');
        }
        await course.destroy();
        success(res, '删除课程成功。', { id: req.params.id });
    } catch (error) {
        failure(res, error);
    }
});


/*
 * 公共方法：白名单过滤
 * @param req
 * return body
 * */
function filterBody(req) {
    return {
        categoryId: req.body.categoryId,
        // userId: req.body.userId,
        name: req.body.name,
        image: req.body.image,
        recommended: req.body.recommended,
        introductory: req.body.introductory,
        content: req.body.content,
        likesCount: req.body.likesCount,
        chaptersCount: req.body.chaptersCount
    };
}
// get添加关联的字段的condition
function getCondition() {
    const condition = {
        attributes: { exclude: ['CategoryId', 'UserId'] },
        include: [
            { model: Category, as: 'category', attributes: ['id', 'name'] },
            { model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }
        ]
    }
return condition
    
}

// 导出路由器
module.exports = router;
