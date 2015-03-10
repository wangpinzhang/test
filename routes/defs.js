var express = require('express');
var async = require('async')
var fs = require('fs');
//var crypto = require('crypto');
var mysqldb = require("../models/db");
var mysql = require('mysql');

var router = express.Router();

/* GET users listing. */
//

router.get('/tablemain', function(req, res){
    ///*
    var fname=req.query.tableid;
    var pnum=req.query.pagenum;
    if (!pnum) pnum=1;
    var tfile='./json/'+fname+'.js';
    fs.readFile(tfile,'utf-8',function(err,tabledata) {
        if (err) throw err;
        var table=eval(tabledata);
        //sql语句拼接
        var sql='select * from '+table.tab.vname+' where 1=1';
        if (table.tab.wh) sql=sql+' '+table.tab.wh;
        if (table.tab.ob) sql=sql+' '+table.tab.ob;
        if (table.tab.perpage!=0) sql=sql+' limit '+String((pnum-1)*table.tab.perpage)+','+String(table.tab.perpage);
        sql=mysqldb.setsql(sql,req);
        //查找总数
        var tsql='select count(1) num from '+table.tab.vname+' where 1=1';
        if (table.tab.wh) tsql=tsql+' '+table.tab.wh;
        tsql=mysqldb.setsql(tsql,req);

        async.parallel([
                function(callback){
                    mysqldb.execquery(sql, function (err, rows, fields) {
                        if (err)  return callback(err);
                        callback(null, rows);
                    });
                },
                function(callback){
                    mysqldb.execquery(tsql, function (err, rows, fields) {
                        if (err)  return callback(err);
                        callback(null, rows[0]);
                    });
                }
            ],
            function(err, results){
                // 在这里处理data和data2的数据,每个文件的内容从results中获取
                var tnum=Math.ceil(results[1].num/table.tab.perpage);
                res.render('cont/modle/tablemain', {
                    tableid:fname,
                    totalnum:tnum,
                    pagenum:pnum,
                    columns:table.cols,
                    rows:results[0]
                });
            }
        );
    });
});

router.get('/formmain', function(req, res){
    var fname=req.query.tableid;
    var recid=req.query.recid;
    var tfile='./json/'+fname+'.js';
    fs.readFile(tfile,'utf-8',function(err,tabledata) {
        if (err) throw err;
        var table=eval(tabledata);
        var sql='select * from '+table.tab.vname +' where id='+mysql.escape(recid);
        mysqldb.execquery(sql, function (err, rows, fields) {
            if (err)  return ;
            res.render('cont/modle/formmain', {
                tableid:fname,
                recid:recid,
                columns:table.cols,
                data:rows[0],
                dtls:table.dtl
            });
        });
    });
});

router.get('/formdetail', function(req, res){
    var fname=req.query.tableid;
    var recid=req.query.recid;
    var tfile='./json/'+fname+'.js';
    fs.readFile(tfile,'utf-8',function(err,tabledata) {
        if (err) throw err;
        var table=eval(tabledata);
        var sql='select * from '+table.tab.vname +' where id='+mysql.escape(recid);
        mysqldb.execquery(sql, function (err, rows, fields) {
            if (err)  return ;
            res.render('cont/modle/formdetail', {
                tableid:fname,
                recid:recid,
                columns:table.cols,
                data:rows[0]
            });
        });
    });
});

router.get('/tabledetail', function(req, res){
    var fname=req.query.tableid;
    var recid=req.query.recid;
    var mid=req.query.mid;
    var pnum=req.query.pagenum;
    if (!pnum) pnum=1;
    var tfile='./json/'+fname+'.js';
    fs.readFile(tfile,'utf-8',function(err,tabledata) {
        if (err) throw err;
        var table=eval(tabledata);
        //sql语句拼接
        var sql='select * from '+table.tab.vname+' where '+mid+'='+mysql.escape(recid);
        if (table.tab.wh) sql=sql+' '+table.tab.wh;
        if (table.tab.ob) sql=sql+' '+table.tab.ob;
        if (table.tab.perpage!=0) sql=sql+' limit '+String((pnum-1)*table.tab.perpage)+','+String(table.tab.perpage);
        sql=mysqldb.setsql(sql,req);
        //查找总数
        var tsql='select count(1) num from '+table.tab.vname+' where '+mid+'='+recid;
        if (table.tab.wh) tsql=tsql+' '+table.tab.wh;
        tsql=mysqldb.setsql(tsql,req);

        async.parallel([
                function(callback){
                    mysqldb.execquery(sql, function (err, rows, fields) {
                        if (err)  return callback(err);
                        callback(null, rows);
                    });
                },
                function(callback){
                    mysqldb.execquery(tsql, function (err, rows, fields) {
                        if (err)  return callback(err);
                        callback(null, rows[0]);
                    });
                }
            ],
            function(err, results){
                // 在这里处理data和data2的数据,每个文件的内容从results中获取
                var tnum=1;
                if (table.tab.perpage>0)  tnum=Math.ceil(results[1].num/table.tab.perpage);
                res.render('cont/modle/tabledetail', {
                    tableid:fname,
                    recid:recid,
                    mid:mid,
                    totalnum:tnum,
                    pagenum:pnum,
                    columns:table.cols,
                    rows:results[0]
                });
            }
        );
    });
});

router.get('/attachdetail', function(req, res){
    res.render('cont/modle/attachdetail', {});
});

router.get('/formguide', function(req, res){
    res.render('cont/modle/formguide', {tableid:'def_test'});
});

router.post('/formpost', function(req, res){
    var fname=req.query.tableid;
    var recid=req.query.recid;
    var tfile='./json/'+fname+'.js';
    fs.readFile(tfile,'utf-8',function(err,tabledata) {
        if (err) throw err;
        var table=eval(tabledata);
        var sql='update '+table.tab.name+' set ? where id='+recid;
        sql=mysql.format(sql, req.body);
        mysqldb.execquery(sql,function (err, result) {
            if (err)  return;
            res.redirect('/defs/formdetail?tableid='+fname+'&recid='+recid);
        });
    });
   // res.render('cont/modle/formguide', {});
});

router.post('/tablepost', function(req, res){
    var fname=req.query.tableid;
    var tfile='./json/'+fname+'.js';
    fs.readFile(tfile,'utf-8',function(err,tabledata) {
        if (err) throw err;
        var table=eval(tabledata);
        var sql='';
        for(var invar in req.body){
            var arr=invar.replace(fname,'').split('_');
            sql=sql+mysql.format('update ?? set ??=? where id=?;',[table.tab.name,arr[2],req.body[invar],arr[1]]);
        }
        if(sql=='')return;
        mysqldb.execquery(sql,function (err, result) {
            if (err)  return;
             res.render('msg', {message:{id:'success',title:'保存成功'}});
        });
    });
});

router.post('/addrow', function(req, res){
    var fname=req.query.tableid;
    var recid=req.query.recid;
    var mid=req.query.mid;
    var tfile='./json/'+fname+'.js';
    fs.readFile(tfile,'utf-8',function(err,tabledata) {
        if (err) throw err;
        var table=eval(tabledata);
        //console.log(sql);
        //sql='select 1;select 2';
        //var sql='update '+table.tab.name+' set ? where id='+recid;
        //sql=mysql.format(sql, req.body);
        //'insert into def_test2(id,mid,)select ifnull(max(id),0)+1,mid from def_testdtl2'
        var insql1='insert into '+table.tab.name+'(id,'+mid;
        var insql2='select ifnull(max(id),0)+1,'+recid;
        for (var i=0;i<table.cols.length;i++){
            if (table.cols[i].default||table.cols[i].default==0){
                insql1=insql1+','+table.cols[i].id;
                insql2=insql2+','+mysql.escape(table.cols[i].default);
            }
        }
        var sql=insql1+')'+insql2+' from '+table.tab.name
        if(sql=='')return;
        mysqldb.execquery(sql,function (err, result) {
            if (err)  return;
            res.render('msg', {message:{id:'success',title:'增加成功'}});
            //res.redirect('/defs/tabledetail?tableid='+fname+'&recid='+recid+'&mid='+mid);
        });
    });
});

router.post('/delrow', function(req, res){
    var fname=req.query.tableid;
    var recid=req.query.recid;
    var tfile='./json/'+fname+'.js';
    fs.readFile(tfile,'utf-8',function(err,tabledata) {
        if (err) throw err;
        var table=eval(tabledata);
        var sql='delete from '+table.tab.name+' where id='+recid;
        if(sql=='')return;
        mysqldb.execquery(sql,function (err, result) {
            if (err)  return;
            //console.log(sql);
            res.render('msg', {message:{id:'success',title:'删除成功'}});
            //res.redirect('/defs/tabledetail?tableid='+fname+'&recid='+recid+'&mid='+mid);
        });
    });
});

module.exports = router;
