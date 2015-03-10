var express = require('express');
var user=require('../models/user');
var crypto = require('crypto');

var router = express.Router();

/* GET users listing. */

router.post('/login', function(req, res){
    var name = req.body["username"];
    var passwd = req.body["password"];
    //生成MD5密码
    var md5 = crypto.createHash('md5');
    // passwd = md5.update(passwd).digest('hex');
    // console.log("MD5后的密码：" + passwd);
    user.get(name,passwd,function(err, user){
        if (err){
            res.render('login', { msg: {title:'登陆失败！'} });
        }
        if (user) {
            req.session.userid = user.id;
            req.session.username = user.name;
            res.redirect('/');
        }else{
            res.render('login', { msg: {title:'用户名或密码错误，登陆失败！'} });
        }
    });
});

router.post('/forget', function(req, res){
    res.render('users/login', { msg: {title:'忘记密码！'} });
});
router.post('/register', function(req, res){
    res.render('login', { msg: {title:'注册！'} });
});


module.exports = router;
