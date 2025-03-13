var express = require('express');
var router = express.Router();
const querySql = require('../db/index')

/* 新增博客接口 */
router.post('/add', async(req, res, next) => {
  let {title,content} = req.body
  let {username} = req.auth
  try {
    let result = await querySql('select id from user where username = ?',[username])
    let user_id = result[0].id
    await querySql('insert into article(title,content,user_id,create_time) values(?,?,?,NOW())',[title,content,user_id])
    res.send({code:0,msg:'新增成功',data:null})
  }catch(e){
    console.log(e)
    next(e)
  } 
});


// 获取全部博客列表接口 
router.get('/allList', async(req, res, next) => {
  try {
    //  DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time 时间转成2025-03-10 11:25:44
    let sql = 'select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article'
    let result = await querySql(sql)
    res.send({code:0,msg:'查询成功',data:result})
  }catch(e){
    console.log(e)
    next(e)
  } 
});

// 获取我的博客列表接口
router.get('/myList', async(req, res, next) => {
  let {username} = req.auth
  try {
    let userSql = 'select id from user where username = ?'
    let user = await querySql(userSql,[username])
    let user_id = user[0].id
    let sql = 'select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article where user_id = ?'
    let result = await querySql(sql,[user_id])
    res.send({code:0,msg:'获取成功',data:result})
  }catch(e){
    console.log(e)
    next(e)
  } 
});

// 获取我的博客详情接口
router.get('/detail', async(req, res, next) => {
  let article_id = req.query.article_id
  try {
    let sql = 'select id,title,content,DATE_FORMAT(create_time,"%Y-%m-%d %H:%i:%s") AS create_time from article where id = ?'
    let result = await querySql(sql,[article_id])
    res.send({code:0,msg:'获取成功',data:result[0]})
  }catch(e){
    console.log(e)
    next(e)
  } 
});

// 删除博客的接口
router.post('/delete', async(req, res, next) => {
  let {article_id} = req.body
  let {username} = req.auth
  try {
    let userSql = 'select id from user where username = ?'
    let user = await querySql(userSql,[username])
    let user_id = user[0].id
    console.log(user_id)
    let sql = 'delete from article where id = ? and user_id = ?'
    let result = await querySql(sql,[article_id,user_id])
    console.log(result)
    res.send({code:0,msg:'删除成功',data:null})
  }catch(e){
    console.log(e)
    next(e)
  } 
});

module.exports = router;
