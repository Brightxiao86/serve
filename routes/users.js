var express = require('express');
var router = express.Router();
const querySql = require('../db/index')
const {PWD_SALT,PRIVATE_KEY,EXPIRESD} = require('../utils/constant')
const {md5,upload} = require('../utils/index')
const jwt = require('jsonwebtoken')


/* 注册接口 */
router.post('/register', async(req, res, next) => {
  let {username,password,nickname} = req.body
  try {
       // 检查用户名是否已存在
    let user = await querySql('select * from user where username = ?',[username])
     // 如果用户名不存在
    if(!user || user.length === 0){
      password = md5(`${password}${PWD_SALT}`)  // 对密码进行加密处理
        // 将新用户数据插入数据
      await querySql('insert into user(username,password,nickname) value(?,?,?)',[username,password,nickname])
      res.send({code:0,msg:'注册成功'})
    }else{
      res.send({code:-1,msg:'该账号已注册'}) // 如果用户名已存在，返回注册失败响应
    }
  }catch(e){
    console.log(e)
    next(e)
  } 
});

// 登录接口
router.post('/login',async(req,res,next) => {
  let {username,password} = req.body
  try {
    let user = await querySql('select * from user where username = ?',[username])
      if(!user || user.length === 0){
        res.send({code:-1,msg:'该账号不存在'})
      }else{
        password = md5(`${password}${PWD_SALT}`)
        let result = await querySql('select * from user where username = ? and password = ?',[username,password])
        if(!result || result.length === 0){
          res.send({code:-1,msg:'账号或者密码不正确'})
        }else{
          let token = jwt.sign({username},PRIVATE_KEY,{expiresIn:EXPIRESD})
          res.send({code:0,msg:'登录成功',token:token})
        }      
      }
  }catch(e){
    console.log(e)
    next(e)
  } 
})

//获取用户信息接口
router.get('/info',async(req,res,next) => {
  let {username} = req.auth
  try {
    let userinfo = await querySql('select nickname,head_img from user where username = ?',[username])
    res.send({code:0,msg:'成功',data:userinfo[0]})
  }catch(e){
    console.log(e)
    next(e)
  } 
})

// 头像上传接口
router.post('/upload',upload.single('head_img'), async(req,res,next) => {
  console.log(req.file)
  let imgPath = req.file.path.split('public')[1]
  let umgUrl = 'http://127.0.0.1:3000' + imgPath // 拼接
  res.send({code:0,msg:'上传成功',data:umgUrl})
})

//用户信息更新接口 
router.post('/updateUser',async(req,res,next) => {
  let {nickname,head_img} = req.body
  let {username} = req.auth
  try {
  let result =  await querySql('update user set nickname = ?,head_img = ? where username = ?',[nickname,head_img,username])
  res.send({code:0,msg:'更新成功',data:''})
  }catch(e){
    console.log(e)
    next(e)
  } 
})

module.exports = router;
