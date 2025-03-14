var express = require('express');
var router = express.Router();
const querySql = require('../db/index')

/**
 * 新增博客接口
 * @param {Object} req - 请求对象，包含用户提交的注册信息
 * @param {Object} res - 响应对象，用于向客户端发送响应
 * @param {Function} next - 中间件函数，用于将错误传递给下一个中间件
 */
router.post('/add', async(req, res, next) => {
  let {title,content} = req.body  // 从请求体中提取文章标题和内容
  let {username} = req.auth  // 从认证信息中提取用户名
  try {
    let result = await querySql('select id from user where username = ?',[username])    // 查询用户ID
    let user_id = result[0].id     // 获取用户ID
     // 插入新文章记录
    await querySql('insert into article(title,content,user_id,create_time) values(?,?,?,NOW())',[title,content,user_id])
    res.send({code:0,msg:'新增成功',data:null})   // 发送新增成功的响应
  }catch(e){
    console.log(e)
    next(e)
  } 
});


/**
 * 获取全部博客列表接口 
 * 功能描述：查询文章列表并返回格式化后的时间
 * 详细说明：从article表中查询文章id、标题、内容，并将create_time字段格式化为指定时间格式
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 中间件函数，用于将错误传递给下一个中间件
 */
router.get('/allList', async(req, res, next) => {
  try {
    /**
     * 说明：执行SQL查询获取文章数据
     * 说明：DATE_FORMAT函数用于将create_time字段格式化为指定格式
     * 格式："%Y-%m-%d %H:%i:%s" 表示年-月-日 时:分:秒
     */
    //  DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time 时间转成2025-03-10 11:25:44
    let sql = 'select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article'
    let result = await querySql(sql)   // 说明：执行SQL查询并将结果存储在result变量中
    res.send({code:0,msg:'查询成功',data:result})  // 说明：返回查询结果，包含状态码、消息和数据
  }catch(e){
    console.log(e)
    next(e)
  } 
});

/**
 * 获取我的博客列表接口
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
router.get('/myList', async(req, res, next) => {
  // 从请求头中获取用户名
  let {username} = req.auth
  try {
    let userSql = 'select id from user where username = ?'  // 查询用户ID的SQL语句
    let user = await querySql(userSql,[username])   // 执行SQL查询获取用户信息
    let user_id = user[0].id   // 获取用户ID
      // 查询文章信息的SQL语句，包含格式化创建时间
    let sql = 'select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article where user_id = ?'
    let result = await querySql(sql,[user_id])  // 执行SQL查询获取文章数据
    res.send({code:0,msg:'获取成功',data:result})     // 返回获取成功的响应
  }catch(e){
    console.log(e)
    next(e)
  } 
});

/**
 * 功能描述：获取我的博客详情接口
 * 功能描述：查询文章列表并返回格式化后的时间
 * 详细说明：从article表中查询文章id、标题、内容，并将create_time字段格式化为指定时间格式
 * * 参数说明：
 *   req：HTTP请求对象
 *   res：HTTP响应对象
 *   next：错误处理函数
 *  * 返回值：通过res.send返回文章详情数据
 * 异常处理：捕获异常并传递给错误处理中间件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 中间件函数，用于将错误传递给下一个中间件
 */
router.get('/detail', async(req, res, next) => {
  let article_id = req.query.article_id  // 获取文章ID
  try {
      // 定义SQL查询语句，查询文章详情
    let sql = 'select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article where id = ?'
    let result = await querySql(sql,[article_id]) // 执行SQL查询并获取结果
    res.send({code:0,msg:'获取成功',data:result[0]}) // 返回查询结果
  }catch(e){
    console.log(e)
    next(e)
  } 
});

/**
 * 删除博客的接口
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件函数
 */
router.post('/delete', async(req, res, next) => {
  let {article_id} = req.body // 从请求体中获取文章ID
  let {username} = req.auth // 从认证信息中获取用户名 也就是token中
  try {
    let userSql = 'select id from user where username = ?'  // 查询用户ID的SQL语句
    let user = await querySql(userSql,[username]) // 执行查询用户ID的SQL语句
    let user_id = user[0].id // 获取用户ID
    let sql = 'delete from article where id = ? and user_id = ?' // 删除文章的SQL语句
    let result = await querySql(sql,[article_id,user_id])  // 执行删除文章的SQL语句
    res.send({code:0,msg:'删除成功',data:null})  // 发送删除成功的响应
  }catch(e){
    console.log(e)
    next(e)
  } 

});

module.exports = router;
