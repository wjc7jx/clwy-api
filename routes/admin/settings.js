// 引入Express框架
const express = require('express');
// 创建路由器对象
const router = express.Router();
// 引入Article模型
const { Article } = require('../../models');

const { Op } = require('sequelize');
const {
    getModelRecord,
    success,
    failure
} = require('../../utils/response');

/* 
 * 接口1 - 查询设置详情 
 * GET /admin/settings/
 * */
router.get('/', async function (req, res, next) {
    try {
        const article = await getModelRecord('Setting')
        success(res, '查询设置详情成功。', { article })
    }
    catch (error) {
        failure(res, error)
    }
})


/* 
 * 接口2 - 更新设置
 * PUT /admin/settings/
 * */
router.put('/', async function (req, res, next) {
    try {
        const article = await getModelRecord('Setting');
        const body = filterBody(req);
        await article.update(body);
        success(res, '更新设置成功。', { article },)
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
        icp: req.body.icp,
        copyright: req.body.copyright
    }    
}

// 导出路由器
module.exports = router;