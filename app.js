var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const { expressjwt } = require("express-jwt");
const {PRIVATE_KEY} = require('./utils/constant')

var articleRouter = require('./routes/article');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 校验token 
app.use(expressjwt({
  secret: PRIVATE_KEY,
  algorithms: ["HS256"]
}).unless({
   path: ['/api/user/login', '/api/user/register', '/api/user/upload', '/api/user/allList', '/api/user/detail'] }));//白名单,除了这里写的地址，其他的URL都需要验证

app.use('/api/article', articleRouter);
app.use('/api/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err)
  if (err.name === 'UnauthorizedError') {   
    //  这个需要根据自己的业务逻辑来处理
    res.status(401).send({code:-1,msg:'token验证失败'});
  }else{
    // 设置局部变量，仅在开发环境中提供错误详细信息
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
 // 渲染错误页面
    res.status(err.status || 500);
    res.render('error');
  }
  
});

module.exports = app;
