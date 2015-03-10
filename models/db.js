var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    database :'pip',
    user     : 'root',
    password : '1234',
    multipleStatements: true
}),slice = [].slice;

module.exports = connection;

var commonMethod = function(callback){
    connection = mysql.createConnection(connection.config);
    connection.connect();
    callback.call(connection,callback);
    connection.end();
};

var onerror = function(){
    console.log(err);
};

connection.execquery = function(){
    var args = arguments;
    commonMethod(function(){
        connection.query.apply(connection,args)
            .on('error',onerror);
    });
};

connection.getnextkey = function(table,field,callback){
    this.execquery("select max(??)id from ??",[field,table],function(err, rows, fields) {
        if (rows.length>0){
            callback(null,rows[0].id+1);
        }else{
            callback(null,1);
        }
    });
}

connection.setsql = function (sql,req) {
    return sql.replace(/\:(\w+)/g, function (txt, key) {
        //替换登陆用户名
        if (key=='userid') {
            return this.escape(req.session.userid);
        }
        //替换参数 一般包括[recid、pkid]等
        if (req.query.hasOwnProperty(key)) {
            return this.escape(req.query[key]);
        }
        return txt;
    }.bind(this));
};


