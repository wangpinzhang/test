
var mysqldb = require("./db");
var mysql = require('mysql');
var crypto = require('crypto');

function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
}

module.exports = User;

//存储用户
User.save = function(callback) {
    var md5 = crypto.createHash('md5');
    var emailMD5 = md5.update(this.email.toLowerCase()).digest('hex');
    //要存入数据库的文档

    var user = {
        id : null,
        name : this.name,
        password : this.password,
        email : this.email
    };
    mysqldb.execquery('select id,name,passwd from users where name like ?',[user.name], function (err, rows, fields) {
        if (err) return callback(err);
        if (rows.length>0) return callback('用户已存在！');
        mysqldb.getnextkey('users','id',function(err,id){
            user.id = id;
            mysqldb.execquery('INSERT INTO users SET ?', user, function (err, result) {
                if (err) return callback(err);//有err错误，返回信息
               callback(null, user[0]);//成功保存，返回存储后的userid
             });
         });
    });
};


User.get = function(name,passwd,callback){
    //验证当前用户名密码
    mysqldb.execquery('select id,name,passwd from users where name='+mysql.escape(name)+' and passwd='+mysql.escape(passwd), function (err, rows, fields) {
        if (err) return callback(err);
        callback(null, rows[0]);
    });
};

User.menus = function(userid,callback){
    //获取当前用户权限模块
    mysqldb.execquery('call getmenu(?)', [userid], function (err, rows, fields) {
        if (err){
            return callback(err);
        }
        callback(null, rows[0]);
    });
}


User.test = function(callback){
    mysqldb.getnextkey('users','id',function(err,id){
        callback(err,id);
    });
}
