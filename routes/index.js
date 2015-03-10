var express = require('express');
var async = require('async')
var fs = require('fs');
var user=require('../models/user');


var router = express.Router();

/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req, res) {
    user.menus(1,function(err,menus){
        if (err) return;
        if (menus) res.render('index', { title: '用户',menus:menus,user:{id:1,name:'王品章'} });
    });
});

//登陆界面
router.get('/login', function(req, res) {
    res.render('login', { msg:{title:''}});
    //console.log(router);
});

router.get('/test', function(req, res){
    user.test(function(err,id){
        if (err) return;
        req.session.userid=1;
        req.session.username='王品章';
        if (id) res.render('welcome', { title: id,users:[{id:req.session.userid,name:req.session.username}] });
    });
});

router.get('/test2', function(req, res){
    user.test(function(err,id){
        if (err) return;
        if (id) res.render('welcome', { title: id,users:[{id:req.session.userid,name:req.session.username}] });
    });
});

router.get('/test3', function(req, res){
    res.render('index', { title: '用户',menus:[
        {id:1,name:'模块',ico:'folder-open',url:'',pid:0,haschild:1},
        {id:2,name:'菜单1',ico:'folder-open',url:'',pid:1,haschild:1},
        {id:3,name:'菜单2',ico:'folder-open',url:'',pid:1,haschild:1},
        {id:4,name:'菜单3',ico:'folder-open',url:'',pid:1,haschild:0},
        {id:5,name:'子1',ico:'folder-open',url:'',pid:2,haschild:0},
        {id:6,name:'子2',ico:'folder-open',url:'',pid:2,haschild:0},
        {id:7,name:'子1',ico:'folder-open',url:'',pid:3,haschild:0}
        ],user:{id:req.session.userid,name:req.session.username}
    });
});

router.get('/null', function(req, res){
    res.render('error', { message: '页面尚未配置，请联系管理员。',error:{status:404,stack:'page not found'},user:{id:0,name:''}
    });
});

router.get('/err', function(req, res){
    res.render('error', { message: '页面错误！',error:{status:404,stack:'not found'},user:{id:req.session.userid,name:req.session.username}
    });
});

function checkLogin(req, res, next) {
    if (!req.session.userid) {
        res.redirect('/login');
    }
    next();
}

module.exports = router;
