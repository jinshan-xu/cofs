/*
   数据库模块
*/

const mysql = require('mysql');
var pool = mysql.createPool(
{
   host:'w.rdc.sae.sina.com.cn',
   port:3306,
   user:'o2jwm2lm11',
   password:'h3k2h22m3y040wjw42j5kj0x1z4i44mwlm25hiw1',
   database:'app_myserver',
   connectionLimit:10
});

module.exports = pool;

